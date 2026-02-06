"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface KnowledgeGraphVisualizerProps {
  data: {
    nodes: Array<{
      id: string;
      label: string;
      group: number;
      size?: number;
    }>;
    links: Array<{
      source: string;
      target: string;
      value: number;
    }>;
  };
  width?: number;
  height?: number;
}

export const KnowledgeGraphVisualizer: React.FC<KnowledgeGraphVisualizerProps> = ({
  data,
  width = 800,
  height = 600
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // 清除之前的渲染
    d3.select(svgRef.current).selectAll('*').remove();

    // 创建 SVG 容器
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // 创建力导向图
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links as any).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => (d.size || 10) + 5));

    // 定义颜色比例尺
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 绘制连接线
    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.value));

    // 绘制节点
    const node = svg.append('g')
      .selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // 添加节点圆圈
    node.append('circle')
      .attr('r', (d) => d.size || 10)
      .attr('fill', (d) => color(d.group.toString()));


    // 添加节点标签
    node.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#333')
      .text((d) => d.label);

    // 添加节点悬停效果
    node.on('mouseover', function (event, d) {
      d3.select(this).select('circle')
        .attr('r', (d: any) => (d.size || 10) + 3)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);
      
      d3.select(this).select('text')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold');
    })
    .on('mouseout', function (event, d) {
      d3.select(this).select('circle')
        .attr('r', (d: any) => d.size || 10)
        .attr('stroke', 'none');
      
      d3.select(this).select('text')
        .attr('font-size', '10px')
        .attr('font-weight', 'normal');
    });

    // 更新力导向图
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // 拖拽函数
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

  }, [data, width, height]);

  return (
    <svg ref={svgRef} className="w-full h-full"></svg>
  );
};
