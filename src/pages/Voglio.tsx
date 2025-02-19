import VoglioForm from "@/components/voglio/VoglioForm";
import { useLocation } from "react-router-dom";

export default function Voglio() {
  const { state } = useLocation();
  return <VoglioForm />;
}
