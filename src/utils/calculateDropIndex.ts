export function calculateDropIndex(
  dropContainer: HTMLElement,
  draggedTaskId: string
): number {
  const taskElements = Array.from(
    dropContainer.querySelectorAll("[data-task-id]")
  ) as HTMLElement[]

  let dropIndex = taskElements.length

  for (let i = 0; i < taskElements.length; i++) {
    const el = taskElements[i]
    const box = el.getBoundingClientRect()

    const middleY = box.top + box.height / 2
    const mouseY = window.event instanceof MouseEvent ? window.event.clientY : 0

    if (mouseY < middleY) {
      dropIndex = i
      break
    }
  }

  return dropIndex
}
