"use client";

import * as React from "react";
import { Markmap, deriveOptions, loadCSS, loadJS } from "markmap-view";
import * as markmap from "markmap-view";
import { Transformer } from "markmap-lib";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEMO_SEED } from "@/app/(marketing)/ui/demo-seed";
import { MarkdownPreview } from "@/components/editor/markdown-preview";
import { MapMarkdownSwitch } from "@/components/editor/map-markdown-switch";
import {
  DEFAULT_MARKMAP_JSON_OPTIONS,
  type MarkmapJsonOptions,
} from "@/lib/markmap-options";
import { getMarkmapTransformSnapshot } from "@/lib/markmap-transform";

const transformer = new Transformer();

function getDemoOptions(frontmatterOptions: MarkmapJsonOptions) {
  return deriveOptions({
    ...DEFAULT_MARKMAP_JSON_OPTIONS,
    ...frontmatterOptions,
  });
}

function ensureSvgSize(svg: SVGSVGElement) {
  const container = svg.parentElement;
  if (!container) return;

  const width = Math.max(1, Math.floor(container.clientWidth));
  const height = Math.max(1, Math.floor(container.clientHeight));

  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
}

export function LiveDemoSection() {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const mmRef = React.useRef<Markmap | null>(null);
  const [activeView, setActiveView] = React.useState<"map" | "markdown">("map");

  const initMarkmap = React.useEffectEvent(() => {
    if (!svgRef.current) return;

    ensureSvgSize(svgRef.current);

    const snapshot = getMarkmapTransformSnapshot(transformer, DEMO_SEED);
    const { styles, scripts } = transformer.getUsedAssets(snapshot.features);

    if (styles) loadCSS(styles);
    if (scripts) loadJS(scripts, { getMarkmap: () => markmap });

    mmRef.current = Markmap.create(
      svgRef.current,
      getDemoOptions(snapshot.frontmatterOptions),
      snapshot.root,
    );
  });

  React.useEffect(() => {
    initMarkmap();

    return () => {
      mmRef.current?.destroy();
      mmRef.current = null;
    };
  }, []);

  const handleResize = React.useEffectEvent(() => {
    if (!svgRef.current || !mmRef.current) return;

    ensureSvgSize(svgRef.current);
    mmRef.current.fit();
  });

  React.useEffect(() => {
    if (activeView !== "map") return;
    if (!svgRef.current || typeof ResizeObserver === "undefined") {
      return;
    }

    const target = svgRef.current.parentElement ?? svgRef.current;
    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(target);
    handleResize();

    return () => {
      observer.disconnect();
    };
  }, [activeView]);

  return (
    <section id="demo" className="flex min-h-0 flex-1 flex-col">
      <Card className="flex flex-col overflow-hidden sm:min-h-0 sm:flex-1">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-2 border-b bg-background px-3 py-2 sm:h-11 sm:flex-nowrap sm:px-4 sm:py-0">
          <MapMarkdownSwitch
            activeView={activeView}
            onViewChange={setActiveView}
          />
          {activeView === "map" ? (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => mmRef.current?.fit()}
            >
              Fit
            </Button>
          ) : null}
        </div>
        <div
          className={
            activeView === "map"
              ? "min-h-104 flex-1 p-2 sm:min-h-0 sm:p-4"
              : "min-h-104 flex-1 sm:min-h-0"
          }
        >
          <div
            className={activeView === "map" ? "size-full" : "hidden size-full"}
          >
            <svg ref={svgRef} className="size-full" />
          </div>
          {activeView === "markdown" ? (
            <MarkdownPreview markdown={DEMO_SEED} />
          ) : null}
        </div>
      </Card>
    </section>
  );
}
