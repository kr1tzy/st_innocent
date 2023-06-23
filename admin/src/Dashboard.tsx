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
          if (inquiry["id"] !== json.data.id) {
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
          console.log(json.data);
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
        marginTop: "2.5%",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Title title="Dashboard" />
      {isMobile ? (
        <Grid container spacing={2} style={{ marginTop: "5%" }}>
          <Grid
            item
            xs={12}
            style={{
              marginTop: "2.5%",
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-around",
              padding: "1.5%",
            }}
          >
            <Analytic description={"Visits"} value={analytics.visits} />
            <Analytic description={"Visitors"} value={analytics.unique} />
            <Analytic
              description={"Cities"}
              value={analytics.cities.length | 0}
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-around",
              padding: "1.5%",
            }}
          >
            <Analytic description={"States"} value={analytics.states.length} />
            <Analytic
              description={"Countries"}
              value={analytics.countries.length}
            />
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
      ) : (
        <Grid container spacing={2} style={{ marginTop: isTablet ? "5%" : "" }}>
          <Grid
            item
            xs={12}
            lg={12}
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-around",
              padding: "1.5%",
              fontSize: isTablet ? ".9em" : "",
            }}
          >
            <Analytic description={"Visits"} value={analytics.visits} />
            <Analytic description={"Visitors"} value={analytics.unique} />
            <Analytic description={"Cities"} value={analytics.cities.length} />
            <Analytic description={"States"} value={analytics.states.length} />
            <Analytic
              description={"Countries"}
              value={analytics.countries.length}
            />
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
      )}
    </Container>
  );
}