import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createCode,
  createJson,
  type PlaygroundConfig,
} from "@/lib/playground";

export function CodeOutput({ config }: { config: PlaygroundConfig }) {
  const [copied, setCopied] = useState(false);
  const code = createCode(config);
  const json = createJson(config);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Configuration copied");
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Tabs defaultValue="react" className="code-output">
      <div className="code-toolbar">
        <TabsList>
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copy(code)}
          aria-label="Copy code"
        >
          {copied ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <CopyIcon data-icon="inline-start" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <TabsContent value="react">
        <pre data-testid="react-code">
          <code>{code}</code>
        </pre>
      </TabsContent>
      <TabsContent value="json">
        <pre>
          <code>{json}</code>
        </pre>
      </TabsContent>
    </Tabs>
  );
}
