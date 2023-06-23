import { Fragment, useState, useEffect } from "react";
import {
  List,
  Edit,
  Datagrid,
  SimpleForm,
  TextField,
  TextInput,
  useGetRecordId,
  SaveButton,
  Toolbar,
  useNotify,
  useRefresh,
  EditButton,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  useDataProvider,
} from "react-admin";

export const PageList = () => {
  return (
    <List>
      <Datagrid bulkActionButtons={false} rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <EditButton />
      </Datagrid>
    </List>
  );
};

const PageEditToolbar = (props: any) => {
  const refresh = useRefresh();
  return (
    <Toolbar {...props}>
      <SaveButton onClick={() => refresh()} />
    </Toolbar>
  );
};

export const PageEdit = () => {
  const notify = useNotify();
  const recordId = useGetRecordId();
  const dataProvider = useDataProvider();
  const [images, setImages] = useState<Array<any>>([]);
  const [svgs, setSvgs] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the images so they can be selected
  useEffect(() => {
    dataProvider
      .getList("images", {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: "name", order: "ASC" },
        filter: {},
      })
      .then(({ data }) => {
        let onlySvgs: any = [];
        let otherImages: any = [];
        data.forEach((img) => {
          let selectableImage = { id: img.id, name: img.name };
          if (img.name.includes(".svg")) {
            onlySvgs.push(selectableImage);
            //console.log(`svg: ${JSON.stringify(selectableImage)}`);
          } else {
            otherImages.push(selectableImage);
            //console.log(`other: ${JSON.stringify(selectableImage)}`);
          }
        });
        setImages(otherImages);
        setSvgs(onlySvgs);
        setLoading(false);
      })
      .catch((err) => {
        notify(err, { type: "error" });
        setLoading(false);
      });
  }, [dataProvider, notify]);

  const onError = () => {
    notify("Error saving page!", { type: "error" });
  };

  // Needs updated when adding a page
  let PageForm = <Fragment />;
  switch (recordId) {
    case "_app":
      PageForm = (
        <SimpleForm toolbar={<PageEditToolbar />}>
          <TextInput disabled source="id" />
          <TextInput disabled source="title" />
        </SimpleForm>
      );
      break;
    case "index":
      PageForm = (
        <SimpleForm toolbar={<PageEditToolbar />}>
          <TextInput disabled source="id" />
          <TextInput source="title" />
          <SelectInput
            source="hero_bg"
            choices={images}
            label="Hero background"
          />
          <SelectInput source="hero_svg" choices={svgs} />
          <SelectInput source="welcome_svg" choices={svgs} />
          <TextInput source="welcome_text" fullWidth />
          <TextInput
            source="produce_dist"
            fullWidth
            label="Next produce distribution"
          />
          <TextInput
            source="community_meal"
            fullWidth
            label="Next community meal"
          />
          <SelectInput
            source="faqs_bg"
            choices={images}
            label="Faqs background"
          />
          <ArrayInput source="faqs">
            <SimpleFormIterator fullWidth>
              <TextInput source="question" fullWidth />
              <TextInput source="answer" fullWidth multiline />
            </SimpleFormIterator>
          </ArrayInput>
          <ArrayInput source="parish_life_items">
            <SimpleFormIterator fullWidth inline>
              <TextInput source="title" />
              <SelectInput source="image" choices={images} />
              <TextInput source="text" multiline fullWidth />
            </SimpleFormIterator>
          </ArrayInput>
          <SelectInput
            source="calendar_bg"
            choices={images}
            label="Calendar background"
          />
          <TextInput source="calendar_add_link" fullWidth />
          <ArrayInput source="who_we_are_items">
            <SimpleFormIterator fullWidth inline>
              <TextInput source="title" />
              <SelectInput source="image" choices={images} />
              <TextInput source="text" multiline fullWidth />
            </SimpleFormIterator>
          </ArrayInput>
          <TextInput source="support_link" fullWidth />
          <TextInput source="address" fullWidth />
          <TextInput source="email" fullWidth />
          <TextInput source="phone" fullWidth />
          <TextInput source="facebook" fullWidth />
          <SelectInput source="footer_svg" choices={svgs} />
        </SimpleForm>
      );
      break;
    default:
      onError();
  }

  if (loading) return <h1>Loading...</h1>;
  return <Edit mutationOptions={{ onError }}>{PageForm}</Edit>;
};
