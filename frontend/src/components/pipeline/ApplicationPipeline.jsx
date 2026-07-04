import { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { initialData } from "./data";
import PipelineColumn from "./PipelineColumn";

const STORAGE_KEY = "trackrai_pipeline";

export default function ApplicationPipeline() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  // SAVE ON CHANGE
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function findContainer(id) {
    for (const [key, items] of Object.entries(data)) {
      if (items.find((item) => item.id === id)) {
        return key;
      }
    }
    return null;
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    setData((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex((i) => i.id === activeId);

      let newData = { ...prev };

      // SAME COLUMN → reorder
      if (activeContainer === overContainer) {
        const overIndex = overItems.findIndex((i) => i.id === overId);

        newData[activeContainer] = arrayMove(
          activeItems,
          activeIndex,
          overIndex
        );

        return newData;
      }

      // CROSS COLUMN MOVE
      const item = activeItems[activeIndex];

      newData[activeContainer] = activeItems.filter(
        (i) => i.id !== activeId
      );

      newData[overContainer] = [
        ...overItems,
        { ...item, status: overContainer },
      ];

      return newData;
    });
  }

  return (
    <div className="p-6">
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {Object.entries(data).map(([key, items]) => (
            <SortableContext
              key={key}
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <PipelineColumn
                title={key.toUpperCase()}
                items={items}
              />
            </SortableContext>
          ))}

        </div>

      </DndContext>
    </div>
  );
}