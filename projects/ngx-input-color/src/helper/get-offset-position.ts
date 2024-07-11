export function getOffsetPosition(
  evt: MouseEvent | TouchEvent,
  parent: HTMLElement
) {
  let position = {
    x: 0,
    y: 0,
  };

  if (evt instanceof MouseEvent) {
    position.x = evt.pageX;
    position.y = evt.pageY;
  } else if (evt.touches && evt.touches.length > 0) {
    position.x = evt.touches[0].pageX;
    position.y = evt.touches[0].pageY;
  }

  // Adjust for the parent's offset
  let parentRect = parent.getBoundingClientRect();
  position.x -= parentRect.left + window.scrollX;
  position.y -= parentRect.top + window.scrollY;

  return position;
}
