import React from "react";
import { Card, CardContent } from "./ui/card";
import UserItem from "./useritem";
import Image from "next/image";
export default function Sidebar() {
  return (
    <div className="container fixed  left-[25px] top-[25px] z-10 flex h-[calc(100vh-50px)] w-[250px] flex-col justify-between rounded-[75px] bg-[#495057] text-white ">
      <div className="mx-auto flex flex-col items-center pt-8 text-3xl">
        TrustRent
        <div className="pt-6">
          <Image
            width={150}
            height={0}
            src="https://utfs.io/f/c526e9fc-20b8-465e-88e7-14293d73060a-hgoxk7.png"
            alt="TrustRent Logo"
          />
        </div>
      </div>
      <div className="flex flex-col items-end space-y-6">
        <div className=" hover:width-100% hover:bg-[#0022FF]">Dashboard</div>
        <span>Tenants & Properties</span>
        <div>Reports</div>
        <div>Messages</div>
        <div>Help/Support</div>
      </div>
      <div className="flex flex-col pb-16">
        <Card className=" bg-white">
          <CardContent>
            <UserItem />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
