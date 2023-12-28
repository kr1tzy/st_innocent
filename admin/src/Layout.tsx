import React, { useState } from "react";
import { Layout as AdminLayout, Menu, useSidebarState } from "react-admin";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import {
  //Article as ArticleIcon,
  //Info as InfoIcon,
  Church as ChurchIcon,
  Image as ImageIcon,
  //List as ListIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import AppBar from "./AppBar";

type SubMenuProps = {
  children?: React.ReactNode;
  isDropdownOpen?: boolean;
  leftIcon?: React.ReactElement;
  primaryText?: string;
};

//const SubMenu = (props: SubMenuProps) => {
//const { isDropdownOpen = false, primaryText, leftIcon, children } = props;
//const [isOpen, setIsOpen] = useState(isDropdownOpen);
//const [open, setOpen] = useSidebarState();

//const handleToggle = () => {
//setIsOpen(!isOpen);
//};

//return (
//<React.Fragment>
//<ListItemButton
//dense
//onClick={handleToggle}
//sx={{
//paddingLeft: "1rem",
//color: "action.active",
//}}
//>
//<div style={{ width: "40px" }}>
//{isOpen ? <ExpandMoreIcon /> : leftIcon}
//</div>
//<ListItemText
//inset
//disableTypography
//primary={primaryText}
//sx={{
//paddingLeft: 2,
//fontSize: "1rem",
//color: "text.secondary",
//}}
///>
//</ListItemButton>
//<Collapse in={isOpen} timeout="auto" unmountOnExit>
//<List
//component="div"
//disablePadding
//sx={
//open
//? {
//paddingLeft: "25px",
//transition:
//"padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
//}
//: {
//paddingLeft: 0,
//transition:
//"padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
//}
//}
//>
//{children}
//</List>
//</Collapse>
//</React.Fragment>
//);
//};

const SideMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Menu.Item to="/images" primaryText="Images" leftIcon={<ImageIcon />} />
    <Menu.Item
      to="/pages/index"
      primaryText="Content"
      leftIcon={<ChurchIcon />}
    />
    {/*
    <Menu.Item to="/pages/_app" primaryText="Info" leftIcon={<InfoIcon />} />
    <SubMenu primaryText="Pages" leftIcon={<ArticleIcon />}>
      <Menu.Item to="/pages" primaryText="List" leftIcon={<ListIcon />} />
      <Menu.Item to="/pages/_app" primaryText="Info" leftIcon={<InfoIcon />} />
      <Menu.Item
        to="/pages/index"
        primaryText="Home"
        leftIcon={<ChurchIcon />}
      />
    </SubMenu>
      */}
  </Menu>
);

export default function Layout(props: any) {
  return (
    <div style={{ marginTop: "2.5%" }}>
      <AdminLayout {...props} appBar={AppBar} menu={SideMenu} />
    </div>
  );
}
