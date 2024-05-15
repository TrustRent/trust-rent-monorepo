"use client";
import { Popover } from "./ui/popover";

export function addressInput() {
  return (
    <div>
      <Popover>
        <input type="text" placeholder="Enter Address" />
      </Popover>
    </div>
  );
}
