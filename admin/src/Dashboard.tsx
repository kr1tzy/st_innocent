import { useEffect, useState } from "react";
import { useMediaQuery, useTheme, Container, Card, Grid } from "@mui/material";
import {
  useSidebarState,
  useNotify,
  useDataProvider,
  Title,
} from "react-admin";
import InquiryTable from "./InquiryTable";
import Analytic from "./Analytic";

interface Analytics {
  visits: number;
  unique: number;
  cities: Array<string>;
  states: Array<string>;
  countries: Array<string>;
}

export default function Dashboard() {
  const notify = useNotify();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const dataProvider = useDataProvider();
  const [open, setOpen] = useSidebarState();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesTotal, setInquiriesTotal] = useState<number>(0);
  const [analytics, setAnalytics] = useState<Analytics>({
    visits: 0,
    unique: 0,
    cities: [],
    states: [],
    countries: [],
  });

  const handleInquiryFollowUp = (id: string) => {
    dataProvider
      .inquiryFollowUp(id)
      .then((json: any) => {
        let updatedInquiries: any[] = [];
        inquiries.forEach((inquiry: any) => {
          if (inquiry["_id"] !== json.data._id) {
            updatedInquiries.push(inquiry);
          }
          setInquiries(updatedInquiries);
        });
        notify(json.detail, {
          type: "info",
          autoHideDuration: 5000,
          multiLine: true,
        });
      })
      .catch((err: any) => {
        notify(err.body.detail, {
          type: "error",
          autoHideDuration: 5000,
          multiLine: true,
        });
      });
  };

  useEffect(() => {
    if (isTablet) {
      setOpen(false);
    }
    dataProvider
      .getAnalytics()
      .then((json: any) => {
        if (
          json.data &&
          Object.keys(json.data).length > 0 &&
          json.data.cities
        ) {
          setAnalytics(json.data);
        }
      })
      .catch((err: any) => {
        notify(err.body.detail, {
          type: "error",
          autoHideDuration: 5000,
          multiLine: true,
        });
      });
    dataProvider
      .getInquiries()
      .then((json: any) => {
        if (json.data && json.data.length > 0) {
          setInquiries(json.data);
          setInquiriesTotal(json.data.length);
        }
      })
      .catch((err: any) => {
        notify(err.body.detail, {
          type: "error",
          autoHideDuration: 5000,
          multiLine: true,
        });
      });
  }, []);

  return (
    <Container
      sx={{
        marginTop: isMobile ? "5%" : "1%",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Title title="Dashboard" />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Analytic description={"Visits"} value={analytics.visits} />
        </Grid>
        <Grid item xs={4}>
          <Analytic description={"Visitors"} value={analytics.unique} />
        </Grid>
        <Grid item xs={4}>
          <Analytic
            description={"Cities"}
            value={analytics.cities.length | 0}
          />
        </Grid>
        <Grid item xs={4}>
          <Analytic description={"States"} value={analytics.states.length} />
        </Grid>
        <Grid item xs={4}>
          <Analytic
            description={"Countries"}
            value={analytics.countries.length}
          />
        </Grid>
        <Grid item xs={4}>
          <Analytic description={"Inquiries"} value={inquiriesTotal} />
        </Grid>
        <Grid item xs={12} lg={12}>
          <Card
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              padding: "2.5%",
            }}
          >
            <InquiryTable
              inquiries={inquiries}
              handleFollowUp={handleInquiryFollowUp}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
