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
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // 清除之前的渲染
    d3.select(svgRef.current).selectAll('*').remove();

    // 创建 SVG 容器
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'bg-gray-50 rounded-lg');

    // 创建力导向图
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links as any).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => (d.size || 12) + 8));

    // 定义颜色比例尺
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 绘制连接线
    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.value) * 0.8)
      .attr('stroke-dasharray', (d) => d.value > 1 ? '5,5' : 'none')
      .style('transition', 'stroke 0.3s ease');

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
      .attr('r', (d) => d.size || 12)
      .attr('fill', (d) => color(d.group.toString()))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('transition', 'r 0.3s ease, fill 0.3s ease');

    // 添加节点标签
    node.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', '#333')
      .attr('font-weight', '500')
      .text((d) => d.label)
      .style('pointer-events', 'none')
      .style('transition', 'font-size 0.3s ease');

    // 添加节点悬停效果
    node.on('mouseover', function (event, d) {
      // 高亮当前节点
      d3.select(this).select('circle')
        .attr('r', (d: any) => (d.size || 12) + 5)
        .attr('stroke', '#333')
        .attr('stroke-width', 3);
      
      d3.select(this).select('text')
        .attr('font-size', '13px')
        .attr('font-weight', 'bold');
      
      // 高亮相关链接
      const nodeId = d.id;
      link.style('stroke-opacity', (l: any) => {
        return l.source.id === nodeId || l.target.id === nodeId ? 1 : 0.2;
      })
      .style('stroke-width', (l: any) => {
        return l.source.id === nodeId || l.target.id === nodeId ? Math.sqrt(l.value) * 1.2 : Math.sqrt(l.value) * 0.8;
      });
      
      // 高亮相关节点
      node.style('opacity', (n: any) => {
        // 检查是否与当前节点有链接
        const isConnected = data.links.some((l: any) => {
          return (l.source.id === nodeId && l.target.id === n.id) || 
                 (l.source.id === n.id && l.target.id === nodeId);
        });
        return n.id === nodeId || isConnected ? 1 : 0.3;
      });
    })
    .on('mouseout', function (event, d) {
      // 恢复默认状态
      d3.select(this).select('circle')
        .attr('r', (d: any) => d.size || 12)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
      
      d3.select(this).select('text')
        .attr('font-size', '11px')
        .attr('font-weight', '500');
      
      // 恢复链接状态
      link.style('stroke-opacity', 0.6)
        .style('stroke-width', (d) => Math.sqrt(d.value) * 0.8);
      
      // 恢复所有节点状态
      node.style('opacity', 1);
    });

    // 添加节点进入动画
    node.attr('opacity', 0)
      .attr('transform', (d: any) => `translate(${width / 2}, ${height / 2})`)
      .transition()
      .duration(500)
      .delay((d, i) => i * 10)
      .attr('opacity', 1)
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);

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

    // 生成图例
    if (legendRef.current) {
      d3.select(legendRef.current).selectAll('*').remove();
      
      // 获取唯一的组
      const groups = [...new Set(data.nodes.map((n: any) => n.group))];
      
      const legend = d3.select(legendRef.current)
        .append('div')
        .attr('class', 'flex flex-wrap gap-4 p-2');
      
      groups.forEach((group) => {
        legend.append('div')
          .attr('class', 'flex items-center gap-2')
          .append('div')
          .attr('class', 'w-4 h-4 rounded-full')
          .style('background-color', color(group.toString()))
          .style('border', '2px solid #fff');
        
        legend.append('span')
          .attr('class', 'text-sm font-medium text-gray-700')
          .text(`组 ${group}`);
      });
    }

  }, [data, width, height]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
      <div ref={legendRef} className="absolute top-2 left-2 bg-white bg-opacity-90 p-2 rounded-lg shadow-sm z-10"></div>
    </div>
  );
};
