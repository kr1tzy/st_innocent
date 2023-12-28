import { useEffect, useState } from "react";
import Head from "next/head";
import {
  useTheme,
  Box,
  Container,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import {
  FAQ,
  PLItem,
  CalendarEvent,
  WWAItem,
  Navbar,
  HeroSection,
  WelcomeSection,
  FaqSection,
  ParishLifeSection,
  CalendarSection,
  WhoWeAreSection,
  Footer,
} from "@/components";
import {
  fetchPage,
  fetchCalendarEvents,
  fetchVisitorIP,
  postVisitorIP,
} from "@/api";

type IndexPage = {
  title: string;
  hero_bg: string;
  hero_svg: string;
  welcome_svg: string;
  welcome_text: string;
  produce_dist: string;
  community_meal: string;
  faqs_bg: string;
  faqs: Array<FAQ>;
  parish_life_items: Array<PLItem>;
  calendar_bg: string;
  calendar_add_link: string;
  calendar_events: Array<CalendarEvent>;
  who_we_are_items: Array<WWAItem>;
  support_link: string;
  address: string;
  email: string;
  phone: string;
  facebook: string;
  footer_img: string;
};

export default function Home(props: IndexPage) {
  const theme = useTheme();
  const [userData, setUserData] = useState({});
  useEffect(() => {
    fetchVisitorIP()
      .then((data) => {
        postVisitorIP(data).then((res) => {
          //console.log(JSON.stringify(res));
        });
      })
      .catch((err) => {
        //console.log(err);
      });
  }, []);
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>

      <Navbar support={props.support_link} />
      <HeroSection
        backgroundImage={props.hero_bg}
        cursiveImage={props.hero_svg}
      />
      <WelcomeSection
        churchSvg={props.welcome_svg}
        welcomeText={props.welcome_text}
        produceDist={props.produce_dist}
        communityMeal={props.community_meal}
      />
      <FaqSection faqs={props.faqs} backgroundImage={props.faqs_bg} />
      <ParishLifeSection parishLifeItems={props.parish_life_items} />
      <CalendarSection
        events={props.calendar_events}
        backgroundImage={props.calendar_bg}
        calendarAddLink={props.calendar_add_link}
      />
      <WhoWeAreSection whoWeAreItems={props.who_we_are_items} />
      <Footer
        address={props.address}
        email={props.email}
        phone={props.phone}
        facebook={props.facebook}
        footerImg={props.footer_img}
      />
    </>
  );
}

export async function getStaticProps() {
  const index = await fetchPage("index");
  const calendar = await fetchCalendarEvents();
  return {
    props: { ...index.data, calendar_events: calendar.data },
    revalidate: 10,
  };
}
