import React from "react";
import { Card, CardContent } from "../ui/card";

interface Children {
  children: React.ReactNode;
}
export const CardLayout: React.FC<Children> = ({ children }) => {
  return (
    <Card className="text-softSilver bg-charcoalDust border-brightBlue">
      <CardContent>{children}</CardContent>
    </Card>
  );
};
