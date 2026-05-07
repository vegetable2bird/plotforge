"use client";

import { useCallback } from "react";
import { ReactFlow, Background, Controls, Handle, Position, useNodesState, useEdgesState, Node, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { RelationEdge, RelationNode } from "@/lib/types";

function CustomNode({ data }: { data: { label: string; avatar: string } }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 backdrop-blur-xl transition-all duration-300 hover:border-[color-mix(in_srgb,var(--accent-gradient)_50%,transparent)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:rounded-xl sm:px-4 sm:py-3">
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !border !border-[var(--panel-border)] !bg-[var(--panel-bg)]" />
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white transition-all duration-300 group-hover:shadow-[0_4px_12px_color-mix(in_srgb,var(--accent-gradient)_40%,transparent)] sm:h-11 sm:w-11 sm:rounded-lg sm:text-base" style={{ background: "var(--accent-gradient)" }}>{data.avatar}</div>
        <div>
          <p className="text-xs font-semibold sm:text-sm" style={{ color: "var(--text)" }}>{data.label}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !border !border-[var(--panel-border)] !bg-[var(--panel-bg)]" />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

interface Props {
  nodes: RelationNode[];
  edges: RelationEdge[];
  onNodeClick: (node: RelationNode) => void;
}

export function RelationGraph({ nodes, edges, onNodeClick }: Props) {
  const initialNodes = nodes.map((n) => ({
    id: n.id,
    type: "custom",
    position: { x: n.x, y: n.y },
    data: { label: n.label, avatar: n.avatar },
  }));

  const initialEdges = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.relationType,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: "var(--muted)" },
    style: {
      stroke: "var(--muted)",
      strokeWidth: 2,
      opacity: 0.6,
    },
    labelStyle: { fill: "var(--text)", fontWeight: 600, fontSize: 12 },
    labelBgStyle: { fill: "var(--panel-bg)", stroke: "var(--panel-border)", strokeWidth: 1, rx: 8, opacity: 0.9 },
  }));

  const [flowNodes, , onNodesChange] = useNodesState(initialNodes);
  const [flowEdges] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const data = node.data as { label: string; avatar: string };

      onNodeClick({
        id: node.id,
        characterId: node.id,
        label: data.label,
        avatar: data.avatar,
        x: node.position.x,
        y: node.position.y,
      });
    },
    [onNodeClick],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
      >
        <Background color="var(--muted)" gap={32} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
