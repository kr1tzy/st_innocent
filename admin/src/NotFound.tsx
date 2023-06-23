import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Title } from "react-admin";

export default function NotFound() {
  return (
    <Card>
      <Title title="Not Found" />
      <CardContent>
        <h1>404: Page not found</h1>
      </CardContent>
    </Card>
  );
}
