"use client";

type Shortcut = {
  keys: Set<string>;
  callback: Function;
};

const pressedKeys = new Set<string>();
const shortcuts: Shortcut[] = [];

let mousePos = { x: 0, y: 0 };
let mouseButtons = new Set<number>();

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    pressedKeys.add(e.key);

    shortcuts.forEach(({ keys, callback }) => {
      const allPressed = [...keys].every((k) => pressedKeys.has(k));
      if (allPressed) callback();
    });
  });

  window.addEventListener("keyup", (e) => {
    pressedKeys.delete(e.key);
  });

  window.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  window.addEventListener("mousedown", (e) => {
    mouseButtons.add(e.button);
  });

  window.addEventListener("mouseup", (e) => {
    mouseButtons.delete(e.button);
  });
}

export function isKeyPressed(key: string) {
  return pressedKeys.has(key);
}

export function isMouseDown(button: number = 0) {

  return mouseButtons.has(button);
}

export function mouseX() {
  return mousePos.x;
}

export function mouseY() {
  return mousePos.y;
}

export function localMouseX(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return mousePos.x - rect.left;
}

export function localMouseY(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return mousePos.y - rect.top;
}

export function addShortcut(keys: string[], callback: Function) {
  shortcuts.push({
    keys: new Set(keys),
    callback,
  });
}
