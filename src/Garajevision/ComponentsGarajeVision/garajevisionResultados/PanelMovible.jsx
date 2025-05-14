import React, { useState } from "react";
import { Rnd } from "react-rnd";

/**
 * PanelMovible: Componente reutilizable para drag & resize de paneles
 * Props:
 * - title: string (título en la barra de drag)
 * - children: contenido del panel
 * - defaultSize: { width, height, x, y }
 * - minWidth, minHeight
 * - bounds: límites del movimiento
 * - dragHandleClassName: clase para el área de drag
 * - dragAxis: 'both' | 'x' | 'y'
 * - className: clases extra para el componente Rnd (e.g. z-index)
 */
const PanelMovible = ({
  title,
  children,
  defaultSize = { width: 1200, height: 500, x: 0, y: 0 }, // Adjusted default height
  minWidth = 900,
  minHeight = 200, // Adjusted default minHeight
  bounds = "window", // Cambiado a 'window' para evitar salir del viewport
  dragHandleClassName = "drag-handle-panel",
  dragAxis = "both",
  className = "", // This className is applied to Rnd wrapper
}) => {
  // Calcular tamaño máximo basado en el viewport
  const maxWidth = window.innerWidth - 16; // margen de seguridad
  const maxHeight = window.innerHeight - 16;

  const [size, setSize] = useState({
    width: Math.min(defaultSize.width, maxWidth),
    height: Math.min(defaultSize.height, maxHeight),
  });
  const [position, setPosition] = useState({
    x: defaultSize.x,
    y: defaultSize.y,
  });

  return (
    <Rnd
      size={size}
      position={position}
      minWidth={minWidth}
      minHeight={minHeight}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      bounds={bounds}
      className={className + " bg-transparent"} // RND itself is transparent
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      dragHandleClassName={dragHandleClassName} // Critical: this is the class for the handle element
      dragAxis={dragAxis}
      onDragStop={(_e, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(_e, _direction, ref, _delta, newPosition) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(newPosition);
      }}
    >
      {/* This div is the actual panel visible content and styling */}
      <div className="h-full w-full flex flex-col bg-slate-800/60 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div
          className={`${dragHandleClassName} cursor-grab active:cursor-grabbing select-none w-full h-8 bg-black/30 flex items-center px-4 text-xs text-slate-300 font-medium uppercase tracking-wider flex-shrink-0`}
        >
          {title}
        </div>
        <div className="flex-grow overflow-auto p-3 text-slate-100">
          {children}
        </div>
      </div>
    </Rnd>
  );
};

export default PanelMovible;
