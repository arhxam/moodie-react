import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type SVGProps,
} from "react";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type TargetAndTransition,
} from "motion/react";

import {
  DEFAULT_CONFIG,
  normalizeAuto,
  normalizeBlink,
  normalizeEyeMotion,
  normalizePointer,
  normalizeSpring,
  normalizeSurface,
  type AutoConfig,
  type BlinkConfig,
  type EyeAnimationName,
  type EyeMotionConfig,
  type PointerConfig,
  type SpringConfig,
  type SurfaceConfig,
} from "./config";
import { createEyeAnimationCue } from "./eye-motion";
import {
  createExpressionCue,
  createReactionCue,
  normalizeExpressionMotion,
  type ExpressionMotionConfig,
} from "./expression-motion";
import { SHAPE_NAMES, createShapePath, type ShapeName } from "./geometry";
import {
  EXPRESSION_NAMES,
  resolveExpression,
  type ExpressionMap,
  type ExpressionName,
  type ReactionName,
} from "./presets";
import { useMoodieDefaults } from "./provider";
import { projectEyeOnSurface } from "./surface-projection";

export type GazePoint = { x: number; y: number };
export type MotionPreset =
  "spring" | "gentle" | "snappy" | "bouncy" | "tween" | "none";
export type ReducedMotionPreference = "system" | "always" | "never";
export type ClickAction = "react" | "cycle" | "random" | "none";

export type MoodieHandle = {
  blink: () => void;
  animateEyes: (animation?: EyeAnimationName) => void;
  react: (reaction?: ReactionName) => void;
  setExpression: (expression: string) => void;
  lookAt: (point: GazePoint) => void;
};

export type MoodieProps = Omit<
  SVGProps<SVGSVGElement>,
  "color" | "onChange"
> & {
  expression?: ExpressionName | string;
  defaultExpression?: ExpressionName | string;
  expressions?: ExpressionMap;
  expressionOrder?: readonly string[];
  onExpressionChange?: (expression: string) => void;
  shape?: ShapeName;
  defaultShape?: ShapeName;
  shapeOrder?: readonly ShapeName[];
  onShapeChange?: (shape: ShapeName) => void;
  doubleContextShapeCycle?: boolean;
  color?: string;
  eyeColor?: string;
  size?: number | string;
  eyeScale?: number;
  eyeDistance?: number;
  turn?: number;
  flip?: boolean;
  motion?: MotionPreset;
  spring?: Partial<SpringConfig>;
  expressionMotion?: boolean | Partial<ExpressionMotionConfig>;
  blink?: boolean | Partial<BlinkConfig>;
  eyeMotion?: boolean | Partial<EyeMotionConfig>;
  pointer?: boolean | Partial<PointerConfig>;
  surface?: boolean | Partial<SurfaceConfig>;
  auto?: boolean | Partial<AutoConfig>;
  gaze?: GazePoint | false;
  gazeLimit?: number;
  clickAction?: ClickAction;
  reaction?: ReactionName;
  reducedMotion?: ReducedMotionPreference;
  ariaLabel?: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const randomDelay = (range: readonly [number, number]) =>
  range[0] + Math.random() * (range[1] - range[0]);

const motionSprings: Record<
  Exclude<MotionPreset, "tween" | "none">,
  Partial<SpringConfig>
> = {
  spring: {},
  gentle: { stiffness: 130, damping: 20, mass: 1 },
  snappy: { stiffness: 370, damping: 28, mass: 0.65 },
  bouncy: { stiffness: 260, damping: 12, mass: 0.75 },
};

const neutralTransform = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
};

export const Moodie = forwardRef<MoodieHandle, MoodieProps>(
  function Moodie(providedProps, forwardedRef) {
    const providerDefaults = useMoodieDefaults();
    const {
      expression,
      defaultExpression = DEFAULT_CONFIG.expression,
      expressions = {},
      expressionOrder,
      onExpressionChange,
      shape,
      defaultShape = DEFAULT_CONFIG.shape,
      shapeOrder = SHAPE_NAMES,
      onShapeChange,
      doubleContextShapeCycle = false,
      color = DEFAULT_CONFIG.color,
      eyeColor = DEFAULT_CONFIG.eyeColor,
      size = DEFAULT_CONFIG.size,
      eyeScale = 1,
      eyeDistance = 1,
      turn = 0,
      flip = false,
      motion: motionPreset = "spring",
      spring,
      expressionMotion = true,
      blink = true,
      eyeMotion = true,
      pointer = true,
      surface = true,
      auto = false,
      gaze,
      gazeLimit = 1,
      clickAction = "react",
      reaction,
      reducedMotion = "system",
      ariaLabel = "Animated mood",
      className,
      style,
      onClick,
      onContextMenu,
      onPointerEnter,
      onPointerMove,
      onPointerLeave,
      ...svgProps
    } = { ...providerDefaults, ...providedProps };
    const [internalExpression, setInternalExpression] =
      useState(defaultExpression);
    const currentExpression = expression ?? internalExpression;
    const [internalShape, setInternalShape] = useState(defaultShape);
    const currentShape = shape ?? internalShape;
    const [internalGaze, setInternalGaze] = useState<GazePoint>({ x: 0, y: 0 });
    const [isBlinking, setIsBlinking] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeEyeAnimation, setActiveEyeAnimation] =
      useState<EyeAnimationName | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const surfaceClipId = `moodie-surface-${useId().replace(/:/g, "")}`;
    const blinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const eyeAnimationTimeout = useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const lastIdleEyeAnimation = useRef<EyeAnimationName | null>(null);
    const lastContextMenuAt = useRef(0);
    const systemReducedMotion = useReducedMotion();
    const reactionControls = useAnimationControls();
    const leftExpressionControls = useAnimationControls();
    const rightExpressionControls = useAnimationControls();
    const eyeControls = useAnimationControls();
    const previousExpression = useRef(currentExpression);

    const shouldReduceMotion =
      reducedMotion === "always" ||
      (reducedMotion === "system" && Boolean(systemReducedMotion));
    const blinkConfig = useMemo(
      () => normalizeBlink(blink),
      [
        typeof blink === "boolean" ? blink : blink.enabled,
        typeof blink === "boolean" ? undefined : blink.duration,
        typeof blink === "boolean" ? undefined : blink.interval?.[0],
        typeof blink === "boolean" ? undefined : blink.interval?.[1],
      ],
    );
    const pointerConfig = useMemo(
      () => normalizePointer(pointer),
      [
        typeof pointer === "boolean" ? pointer : pointer.enabled,
        typeof pointer === "boolean" ? undefined : pointer.target,
        typeof pointer === "boolean" ? undefined : pointer.strength,
        typeof pointer === "boolean" ? undefined : pointer.rangeX,
        typeof pointer === "boolean" ? undefined : pointer.rangeY,
        typeof pointer === "boolean" ? undefined : pointer.tilt,
      ],
    );
    const surfaceConfig = useMemo(
      () => normalizeSurface(surface),
      [
        typeof surface === "boolean" ? surface : surface.enabled,
        typeof surface === "boolean" ? undefined : surface.perspective,
        typeof surface === "boolean" ? undefined : surface.edgeCompression,
        typeof surface === "boolean" ? undefined : surface.depth,
        typeof surface === "boolean" ? undefined : surface.bodyFollow,
        typeof surface === "boolean" ? undefined : surface.inertia,
        typeof surface === "boolean" ? undefined : surface.maxTurn,
        typeof surface === "boolean" ? undefined : surface.volumePreservation,
      ],
    );
    const eyeMotionConfig = useMemo(
      () => normalizeEyeMotion(eyeMotion),
      [
        typeof eyeMotion === "boolean" ? eyeMotion : eyeMotion.enabled,
        typeof eyeMotion === "boolean" ? undefined : eyeMotion.idle,
        typeof eyeMotion === "boolean"
          ? undefined
          : eyeMotion.idleAnimations?.join("|"),
        typeof eyeMotion === "boolean" ? undefined : eyeMotion.interval?.[0],
        typeof eyeMotion === "boolean" ? undefined : eyeMotion.interval?.[1],
        typeof eyeMotion === "boolean" ? undefined : eyeMotion.intensity,
        typeof eyeMotion === "boolean" ? undefined : eyeMotion.hover,
        typeof eyeMotion === "boolean" ? undefined : eyeMotion.hoverReaction,
        typeof eyeMotion === "boolean" ? undefined : eyeMotion.contextMenuBlink,
      ],
    );
    const autoConfig = useMemo(
      () => normalizeAuto(auto),
      [
        typeof auto === "boolean" ? auto : auto.enabled,
        typeof auto === "boolean" ? undefined : auto.interval?.[0],
        typeof auto === "boolean" ? undefined : auto.interval?.[1],
        typeof auto === "boolean" ? undefined : auto.expressions?.join("|"),
      ],
    );
    const springConfig = useMemo(
      () =>
        normalizeSpring({
          ...motionSprings[motionPreset as keyof typeof motionSprings],
          ...spring,
        }),
      [motionPreset, spring?.stiffness, spring?.damping, spring?.mass],
    );
    const expressionMotionConfig = useMemo(
      () => normalizeExpressionMotion(expressionMotion),
      [
        typeof expressionMotion === "boolean"
          ? expressionMotion
          : expressionMotion.enabled,
        typeof expressionMotion === "boolean"
          ? undefined
          : expressionMotion.intensity,
        typeof expressionMotion === "boolean"
          ? undefined
          : expressionMotion.duration,
        typeof expressionMotion === "boolean"
          ? undefined
          : expressionMotion.eyes,
        typeof expressionMotion === "boolean"
          ? undefined
          : expressionMotion.body,
        typeof expressionMotion === "boolean"
          ? undefined
          : expressionMotion.anticipation,
        typeof expressionMotion === "boolean"
          ? undefined
          : expressionMotion.overshoot,
        typeof expressionMotion === "boolean"
          ? undefined
          : expressionMotion.stagger,
      ],
    );

    const transition =
      shouldReduceMotion || motionPreset === "none"
        ? { duration: 0 }
        : motionPreset === "tween"
          ? { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }
          : { type: "spring" as const, ...springConfig };
    const eyeTransition =
      shouldReduceMotion || motionPreset === "none"
        ? { duration: 0 }
        : motionPreset === "tween"
          ? {
              duration: 0.22 + surfaceConfig.inertia * 0.1,
              ease: [0.22, 1, 0.36, 1] as const,
            }
          : {
              type: "spring" as const,
              stiffness:
                springConfig.stiffness * (1.06 - surfaceConfig.inertia * 0.06),
              damping:
                springConfig.damping * (1.08 + surfaceConfig.inertia * 0.08),
              mass: springConfig.mass * (0.68 + surfaceConfig.inertia * 0.2),
            };
    const bodyTransition =
      shouldReduceMotion || motionPreset === "none"
        ? { duration: 0 }
        : motionPreset === "tween"
          ? {
              duration: 0.32 + surfaceConfig.inertia * 0.18,
              ease: [0.22, 1, 0.36, 1] as const,
            }
          : {
              type: "spring" as const,
              stiffness:
                springConfig.stiffness * (0.82 - surfaceConfig.inertia * 0.12),
              damping:
                springConfig.damping * (1.12 + surfaceConfig.inertia * 0.18),
              mass: springConfig.mass * (1.08 + surfaceConfig.inertia * 0.72),
            };

    const definition = resolveExpression(currentExpression, expressions);
    const expressionMotionEnabled =
      expressionMotionConfig.enabled &&
      !shouldReduceMotion &&
      motionPreset !== "none";
    const eyeMotionEnabled =
      eyeMotionConfig.enabled && !shouldReduceMotion && motionPreset !== "none";
    const bodyPath = createShapePath(currentShape);
    const activeGaze = gaze === false ? { x: 0, y: 0 } : (gaze ?? internalGaze);
    const normalizedGaze = {
      x: clamp(activeGaze.x, -1, 1),
      y: clamp(activeGaze.y, -1, 1),
    };
    const limitedGaze = {
      x: clamp(normalizedGaze.x * clamp(gazeLimit, 0, 2), -1, 1),
      y: clamp(normalizedGaze.y * clamp(gazeLimit, 0, 2), -1, 1),
    };
    const leftProjection = projectEyeOnSurface({
      geometry: definition.left,
      side: -1,
      gaze: limitedGaze,
      rangeX: pointerConfig.rangeX,
      rangeY: pointerConfig.rangeY,
      eyeScale,
      eyeDistance,
      turn,
      surface: surfaceConfig,
    });
    const rightProjection = projectEyeOnSurface({
      geometry: definition.right,
      side: 1,
      gaze: limitedGaze,
      rangeX: pointerConfig.rangeX,
      rangeY: pointerConfig.rangeY,
      eyeScale,
      eyeDistance,
      turn,
      surface: surfaceConfig,
    });
    const leftPath = leftProjection.path;
    const rightPath = rightProjection.path;

    const updateExpression = useCallback(
      (nextExpression: string) => {
        if (expression === undefined) setInternalExpression(nextExpression);
        onExpressionChange?.(nextExpression);
      },
      [expression, onExpressionChange],
    );

    const updateShape = useCallback(
      (nextShape: ShapeName) => {
        if (shape === undefined) setInternalShape(nextShape);
        onShapeChange?.(nextShape);
      },
      [onShapeChange, shape],
    );

    const playReaction = useCallback(
      (
        nextReaction: ReactionName = reaction ??
          definition.reaction ??
          "bounce",
      ) => {
        if (
          shouldReduceMotion ||
          motionPreset === "none" ||
          nextReaction === "none"
        )
          return;
        reactionControls.stop();
        reactionControls.set(neutralTransform);
        void reactionControls.start(
          createReactionCue(
            nextReaction as Exclude<ReactionName, "none">,
            expressionMotionConfig,
          ) as TargetAndTransition,
        );
      },
      [
        definition.reaction,
        expressionMotionConfig.duration,
        expressionMotionConfig.intensity,
        motionPreset,
        reaction,
        reactionControls,
        shouldReduceMotion,
      ],
    );

    const triggerBlink = useCallback(() => {
      if (blinkTimeout.current) clearTimeout(blinkTimeout.current);
      setIsBlinking(true);
      blinkTimeout.current = setTimeout(
        () => setIsBlinking(false),
        blinkConfig.duration,
      );
    }, [blinkConfig.duration]);

    const playEyeAnimation = useCallback(
      (animation: EyeAnimationName = "notice") => {
        if (!eyeMotionEnabled) return;
        if (eyeAnimationTimeout.current)
          clearTimeout(eyeAnimationTimeout.current);
        const cue = createEyeAnimationCue(animation, eyeMotionConfig.intensity);
        eyeControls.stop();
        eyeControls.set(neutralTransform);
        setActiveEyeAnimation(animation);
        void eyeControls.start(cue as TargetAndTransition);
        eyeAnimationTimeout.current = setTimeout(
          () => setActiveEyeAnimation(null),
          cue.transition.duration * 1000,
        );
      },
      [eyeControls, eyeMotionConfig.intensity, eyeMotionEnabled],
    );

    const updateGaze = useCallback(
      (clientX: number, clientY: number, surface: Element) => {
        if (!pointerConfig.enabled || gaze !== undefined) return;
        const bounds = surface.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        setInternalGaze({
          x:
            clamp(((clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1) *
            pointerConfig.strength,
          y:
            clamp(((clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1) *
            pointerConfig.strength,
        });
      },
      [gaze, pointerConfig.enabled, pointerConfig.strength],
    );

    const enterSurface = useCallback(() => {
      setIsHovered(true);
      if (eyeMotionConfig.hover !== "none")
        playEyeAnimation(eyeMotionConfig.hover);
      if (eyeMotionEnabled && eyeMotionConfig.hoverReaction !== "none")
        playReaction(eyeMotionConfig.hoverReaction);
    }, [
      eyeMotionConfig.hover,
      eyeMotionConfig.hoverReaction,
      eyeMotionEnabled,
      playEyeAnimation,
      playReaction,
    ]);

    const leaveSurface = useCallback(() => {
      setIsHovered(false);
      if (pointerConfig.enabled && gaze === undefined)
        setInternalGaze({ x: 0, y: 0 });
    }, [gaze, pointerConfig.enabled]);

    const leaveFace = useCallback(() => setIsHovered(false), []);

    const orderedShapes = useMemo(() => {
      const validShapes = shapeOrder.filter((candidate) =>
        SHAPE_NAMES.includes(candidate),
      );
      return validShapes.length > 0
        ? [...new Set(validShapes)]
        : [...SHAPE_NAMES];
    }, [shapeOrder]);

    const cycleShape = useCallback(() => {
      const currentIndex = orderedShapes.indexOf(currentShape);
      updateShape(orderedShapes[(currentIndex + 1) % orderedShapes.length]);
    }, [currentShape, orderedShapes, updateShape]);

    const handleContextMenuGesture = useCallback(
      (event: Event) => {
        if (event.defaultPrevented) return;
        const now = Date.now();
        const isDoubleContext =
          doubleContextShapeCycle && now - lastContextMenuAt.current <= 420;
        lastContextMenuAt.current = isDoubleContext ? 0 : now;
        const shouldBlink =
          eyeMotionConfig.enabled && eyeMotionConfig.contextMenuBlink;
        if (!shouldBlink && !doubleContextShapeCycle) return;
        event.preventDefault();
        if (shouldBlink) triggerBlink();
        if (isDoubleContext) cycleShape();
      },
      [
        cycleShape,
        doubleContextShapeCycle,
        eyeMotionConfig.contextMenuBlink,
        eyeMotionConfig.enabled,
        triggerBlink,
      ],
    );

    const orderedExpressions = useMemo(() => {
      const requested = expressionOrder ?? autoConfig.expressions;
      const catalog = requested?.length
        ? requested
        : [...EXPRESSION_NAMES, ...Object.keys(expressions)];
      return [...new Set(catalog)];
    }, [autoConfig.expressions, expressionOrder, expressions]);

    const cycleExpression = useCallback(
      (random = false) => {
        const currentIndex = orderedExpressions.indexOf(currentExpression);
        let nextIndex = (currentIndex + 1) % orderedExpressions.length;
        if (random && orderedExpressions.length > 1) {
          const candidates = orderedExpressions.filter(
            (name) => name !== currentExpression,
          );
          return updateExpression(
            candidates[Math.floor(Math.random() * candidates.length)],
          );
        }
        updateExpression(orderedExpressions[nextIndex] ?? "neutral");
      },
      [currentExpression, orderedExpressions, updateExpression],
    );

    useImperativeHandle(
      forwardedRef,
      () => ({
        blink: triggerBlink,
        animateEyes: playEyeAnimation,
        react: playReaction,
        setExpression: updateExpression,
        lookAt: (point) =>
          setInternalGaze({
            x: clamp(point.x, -1, 1),
            y: clamp(point.y, -1, 1),
          }),
      }),
      [playEyeAnimation, playReaction, triggerBlink, updateExpression],
    );

    useEffect(() => {
      if (pointerConfig.enabled) return;
      setInternalGaze({ x: 0, y: 0 });
    }, [pointerConfig.enabled]);

    useEffect(() => {
      if (eyeMotionEnabled) return;
      eyeControls.stop();
      eyeControls.set(neutralTransform);
      setActiveEyeAnimation(null);
    }, [eyeControls, eyeMotionEnabled]);

    useEffect(() => {
      const previous = previousExpression.current;
      previousExpression.current = currentExpression;
      if (previous === currentExpression || !expressionMotionEnabled) return;

      if (expressionMotionConfig.eyes) {
        leftExpressionControls.stop();
        rightExpressionControls.stop();
        leftExpressionControls.set(neutralTransform);
        rightExpressionControls.set(neutralTransform);
        void leftExpressionControls.start(
          createExpressionCue(definition.performance, expressionMotionConfig),
        );
        void rightExpressionControls.start(
          createExpressionCue(
            definition.performance,
            expressionMotionConfig,
            expressionMotionConfig.stagger,
          ),
        );
      }
      if (expressionMotionConfig.body) playReaction();
    }, [
      currentExpression,
      definition.performance,
      leftExpressionControls,
      rightExpressionControls,
      expressionMotionConfig,
      expressionMotionEnabled,
      playReaction,
    ]);

    useEffect(() => {
      if (!blinkConfig.enabled || shouldReduceMotion) return;
      let timer: ReturnType<typeof setTimeout>;
      let cancelled = false;
      const schedule = () => {
        timer = setTimeout(() => {
          if (
            cancelled ||
            (typeof document !== "undefined" && document.hidden)
          ) {
            schedule();
            return;
          }
          triggerBlink();
          schedule();
        }, randomDelay(blinkConfig.interval));
      };
      schedule();
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }, [
      blinkConfig.enabled,
      blinkConfig.interval,
      shouldReduceMotion,
      triggerBlink,
    ]);

    useEffect(() => {
      if (
        !eyeMotionEnabled ||
        !eyeMotionConfig.idle ||
        eyeMotionConfig.idleAnimations.length === 0
      )
        return;
      let timer: ReturnType<typeof setTimeout>;
      let cancelled = false;
      const schedule = () => {
        timer = setTimeout(() => {
          if (
            cancelled ||
            isHovered ||
            (typeof document !== "undefined" && document.hidden)
          ) {
            schedule();
            return;
          }
          const candidates = eyeMotionConfig.idleAnimations.filter(
            (animation) => animation !== lastIdleEyeAnimation.current,
          );
          const catalog = candidates.length
            ? candidates
            : eyeMotionConfig.idleAnimations;
          const next = catalog[Math.floor(Math.random() * catalog.length)];
          if (next) {
            lastIdleEyeAnimation.current = next;
            playEyeAnimation(next);
          }
          schedule();
        }, randomDelay(eyeMotionConfig.interval));
      };
      schedule();
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }, [
      eyeMotionConfig.idle,
      eyeMotionConfig.idleAnimations,
      eyeMotionConfig.interval,
      eyeMotionEnabled,
      isHovered,
      playEyeAnimation,
    ]);

    useEffect(() => {
      if (
        !autoConfig.enabled ||
        shouldReduceMotion ||
        orderedExpressions.length < 2
      )
        return;
      const timer = setTimeout(
        () => cycleExpression(true),
        randomDelay(autoConfig.interval),
      );
      return () => clearTimeout(timer);
    }, [
      autoConfig.enabled,
      autoConfig.interval,
      currentExpression,
      cycleExpression,
      orderedExpressions.length,
      shouldReduceMotion,
    ]);

    useEffect(
      () => () => {
        if (blinkTimeout.current) clearTimeout(blinkTimeout.current);
        if (eyeAnimationTimeout.current)
          clearTimeout(eyeAnimationTimeout.current);
      },
      [],
    );

    useEffect(() => {
      if (!pointerConfig.enabled || pointerConfig.target !== "parent") return;
      const surface = svgRef.current?.parentElement;
      if (!surface) return;
      const move = (event: Event) => {
        const pointerEvent = event as PointerEvent;
        updateGaze(pointerEvent.clientX, pointerEvent.clientY, surface);
      };
      const enter = (event: Event) => {
        move(event);
      };
      const leave = () => leaveSurface();
      const contextMenu = (event: Event) => handleContextMenuGesture(event);
      surface.addEventListener("pointermove", move);
      surface.addEventListener("pointerenter", enter);
      surface.addEventListener("pointerleave", leave);
      surface.addEventListener("contextmenu", contextMenu);
      return () => {
        surface.removeEventListener("pointermove", move);
        surface.removeEventListener("pointerenter", enter);
        surface.removeEventListener("pointerleave", leave);
        surface.removeEventListener("contextmenu", contextMenu);
      };
    }, [
      handleContextMenuGesture,
      leaveSurface,
      pointerConfig.enabled,
      pointerConfig.target,
      updateGaze,
    ]);

    const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
      onPointerMove?.(event);
      if (pointerConfig.target !== "self") return;
      updateGaze(event.clientX, event.clientY, event.currentTarget);
    };

    const handlePointerEnter = (event: ReactPointerEvent<SVGSVGElement>) => {
      onPointerEnter?.(event);
      enterSurface();
    };

    const handlePointerLeave = (event: ReactPointerEvent<SVGSVGElement>) => {
      onPointerLeave?.(event);
      if (pointerConfig.target === "self") leaveSurface();
      else leaveFace();
    };

    const handleContextMenu = (event: ReactMouseEvent<SVGSVGElement>) => {
      onContextMenu?.(event);
      if (event.defaultPrevented || pointerConfig.target !== "self") return;
      handleContextMenuGesture(event.nativeEvent);
    };

    const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (clickAction === "cycle") cycleExpression();
      if (clickAction === "random") cycleExpression(true);
      if (clickAction === "react") playReaction();
    };

    const mergedStyle = {
      display: "block",
      overflow: "visible",
      cursor: clickAction === "none" ? undefined : "pointer",
      touchAction: pointerConfig.enabled ? "none" : undefined,
      ...style,
    } satisfies CSSProperties;

    return (
      <svg
        {...svgProps}
        ref={svgRef}
        role="img"
        aria-label={ariaLabel}
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className={className}
        style={mergedStyle}
        data-expression={currentExpression}
        data-shape={currentShape}
        data-blinking={String(isBlinking)}
        data-gaze-x={String(Number(normalizedGaze.x.toFixed(3)))}
        data-gaze-y={String(Number(normalizedGaze.y.toFixed(3)))}
        data-reduced-motion={String(shouldReduceMotion)}
        data-expression-motion={String(expressionMotionEnabled)}
        data-pointer-strength={String(pointerConfig.strength)}
        data-pointer-range-x={String(pointerConfig.rangeX)}
        data-pointer-range-y={String(pointerConfig.rangeY)}
        data-pointer-tilt={String(pointerConfig.tilt)}
        data-pointer-target={pointerConfig.target}
        data-surface-enabled={String(surfaceConfig.enabled)}
        data-surface-perspective={String(surfaceConfig.perspective)}
        data-surface-edge-compression={String(surfaceConfig.edgeCompression)}
        data-surface-depth={String(surfaceConfig.depth)}
        data-surface-body-follow={String(surfaceConfig.bodyFollow)}
        data-surface-inertia={String(surfaceConfig.inertia)}
        data-surface-max-turn={String(surfaceConfig.maxTurn)}
        data-surface-volume-preservation={String(
          surfaceConfig.volumePreservation,
        )}
        data-left-eye-compression={String(leftProjection.compression)}
        data-right-eye-compression={String(rightProjection.compression)}
        data-left-eye-depth={String(leftProjection.depthScale)}
        data-right-eye-depth={String(rightProjection.depthScale)}
        data-hovered={String(isHovered)}
        data-eye-motion={String(eyeMotionEnabled)}
        data-eye-animation={activeEyeAnimation ?? "none"}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
      >
        <defs>
          <clipPath id={surfaceClipId} clipPathUnits="userSpaceOnUse">
            <motion.path
              data-part="body-clip"
              d={bodyPath}
              initial={false}
              animate={{
                d: bodyPath,
                rotate: definition.body?.rotate ?? 0,
                scaleX: (definition.body?.scaleX ?? 1) * (flip ? -1 : 1),
                scaleY: definition.body?.scaleY ?? 1,
                y: definition.body?.y ?? 0,
              }}
              transition={transition}
              style={{ transformOrigin: "100px 100px" }}
            />
          </clipPath>
        </defs>
        <motion.g
          data-part="pointer-performance"
          animate={{
            x: shouldReduceMotion
              ? 0
              : surfaceConfig.enabled
                ? limitedGaze.x *
                  pointerConfig.rangeX *
                  surfaceConfig.bodyFollow *
                  0.28
                : limitedGaze.x * 2.5,
            y: shouldReduceMotion
              ? 0
              : surfaceConfig.enabled
                ? limitedGaze.y *
                  pointerConfig.rangeY *
                  surfaceConfig.bodyFollow *
                  0.28
                : limitedGaze.y * 1.75,
            rotate: shouldReduceMotion ? 0 : limitedGaze.x * pointerConfig.tilt,
            scaleX:
              shouldReduceMotion || !surfaceConfig.enabled
                ? 1
                : 1 -
                  Math.abs(limitedGaze.x) * surfaceConfig.bodyFollow * 0.05 +
                  Math.abs(limitedGaze.y) * surfaceConfig.bodyFollow * 0.018,
            scaleY:
              shouldReduceMotion || !surfaceConfig.enabled
                ? 1
                : 1 -
                  Math.abs(limitedGaze.y) * surfaceConfig.bodyFollow * 0.05 +
                  Math.abs(limitedGaze.x) * surfaceConfig.bodyFollow * 0.018,
          }}
          transition={bodyTransition}
          style={{ transformOrigin: "100px 100px" }}
        >
          <motion.g
            animate={reactionControls}
            style={{ transformOrigin: "100px 100px" }}
          >
            <motion.path
              data-part="body"
              d={bodyPath}
              fill={color}
              initial={false}
              animate={{
                d: bodyPath,
                rotate: definition.body?.rotate ?? 0,
                scaleX: (definition.body?.scaleX ?? 1) * (flip ? -1 : 1),
                scaleY: definition.body?.scaleY ?? 1,
                y: definition.body?.y ?? 0,
              }}
              transition={transition}
              style={{ transformOrigin: "100px 100px" }}
            />
            <motion.g
              data-part="eyes"
              clipPath={`url(#${surfaceClipId})`}
              style={{ transformOrigin: "100px 96px" }}
            >
              <motion.g
                data-part="eye-performance"
                animate={eyeControls}
                style={{ transformOrigin: "100px 96px" }}
              >
                <motion.g
                  data-part="blink"
                  animate={{ scaleY: isBlinking ? 0.06 : 1 }}
                  transition={
                    isBlinking
                      ? { duration: blinkConfig.duration / 2000 }
                      : transition
                  }
                  style={{ transformOrigin: "100px 96px" }}
                >
                  <motion.g
                    data-part="left-expression-cue"
                    animate={leftExpressionControls}
                    style={{ transformOrigin: "100px 96px" }}
                  >
                    <motion.path
                      data-part="left-eye"
                      d={leftPath}
                      fill={eyeColor}
                      initial={false}
                      animate={{ d: leftPath }}
                      transition={eyeTransition}
                    />
                  </motion.g>
                  <motion.g
                    data-part="right-expression-cue"
                    animate={rightExpressionControls}
                    style={{ transformOrigin: "100px 96px" }}
                  >
                    <motion.path
                      data-part="right-eye"
                      d={rightPath}
                      fill={eyeColor}
                      initial={false}
                      animate={{ d: rightPath }}
                      transition={eyeTransition}
                    />
                  </motion.g>
                </motion.g>
              </motion.g>
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>
    );
  },
);
