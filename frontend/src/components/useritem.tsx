export default function UserItem() {
  return (
    <div className="border-brightBlue flex min-h-2 items-center justify-center gap-2 rounded-[8px] border p-2">
      <div className="avatar bg-brightBlue flex min-h-12 min-w-12 items-center justify-center rounded-full text-white">
        <p>BR</p>
      </div>
      <div>
        <p className="text-softSilver text-[16px] font-bold">Brandon Robb</p>
        <p className="text-softSilver text-[12px]">Fuck</p>
      </div>
    </div>
  );
}
