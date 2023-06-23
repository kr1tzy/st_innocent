// @ts-nocheck
import React, { useState } from "react";
import {
  List,
  Show,
  Edit,
  Button,
  Datagrid,
  TextField,
  ImageField,
  TextInput,
  SimpleForm,
  EditButton,
  SimpleShowLayout,
  useDataProvider,
  ShowButton,
  useRefresh,
  useNotify,
  InfiniteList,
  useListContext,
  InfinitePagination,
} from "react-admin";
import {
  useMediaQuery,
  Typography,
  Modal,
  useTheme,
  Card,
  Box,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

export const ImageList = (props: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const notify = useNotify();

  const UploadButton = () => (
    <Button
      onClick={() => {
        handleOpen();
      }}
      label="Upload"
    >
      <UploadIcon />
    </Button>
  );

  const Empty = () => (
    <Box
      textAlign="center"
      m={1}
      sx={{
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "white",
        p: 4,
      }}
    >
      <Typography variant="h4" paragraph>
        No images saved
      </Typography>
      <UploadButton />
    </Box>
  );

  const CustomPagination = () => {
    const { total } = useListContext();
    return (
      <>
        <InfinitePagination />
        {total > 0 && (
          <Box position="sticky" bottom={0} textAlign="center">
            <Card
              elevation={2}
              sx={{
                px: 2,
                py: 1,
                mb: 1,
                display: "inline-block",
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
              }}
            >
              <Typography variant="body2">{total} images</Typography>
            </Card>
          </Box>
        )}
      </>
    );
  };

  const ResponsiveImageList = () => {
    if (isMobile) {
      // Phone
      return (
        <InfiniteList
          title="Images"
          empty={<Empty />}
          actions={<UploadButton />}
          pagination={<CustomPagination />}
        >
          <Datagrid rowClick="edit">
            <TextField source="size" label="Size" sortable={true} />
            <ImageField source="admin_url" label="Image" sortable={false} />
          </Datagrid>
          <InfinitePagination />
        </InfiniteList>
      );
    } else if (isTablet) {
      //Tablet
      return (
        <InfiniteList
          title="Images"
          empty={<Empty />}
          actions={<UploadButton />}
          pagination={<CustomPagination />}
        >
          <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="size" />
            <ImageField source="admin_url" label="Image" sortable={false} />
          </Datagrid>
        </InfiniteList>
      );
    } else {
      // Desktop
      return (
        <List title="Images" empty={<Empty />} actions={<UploadButton />}>
          <Datagrid>
            <TextField source="id" sortable={false} label="id" />
            <TextField source="name" />
            <TextField source="content_type" />
            <TextField source="size" />
            <ImageField source="admin_url" label="Image" sortable={false} />
            <EditButton />
            <ShowButton />
          </Datagrid>
        </List>
      );
    }
  };

  return (
    <React.Fragment>
      <ResponsiveImageList />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            padding: "2.5%",
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            color: "white",
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ color: theme.palette.primary.main }}
          >
            Upload Image
          </Typography>
          <br />
          <input
            type="file"
            style={{ fontSize: "1rem", color: "#90caf9" }}
            onChange={(event) => {
              if (event.target.files != null) {
                dataProvider
                  .uploadImage(event.target.files[0])
                  .then((json: any) => {
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
                handleClose();
                refresh();
              }
            }}
          />
        </Box>
      </Modal>
    </React.Fragment>
  );
};
export const ImageShow = (props: any) => {
  return (
    <Show title="Show Image">
      <SimpleShowLayout>
        <ImageField
          sx={{
            "& .RaImageField-image": {
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            },
          }}
          label="Image"
          source="admin_url"
        />
      </SimpleShowLayout>
    </Show>
  );
};

export const ImageEdit = () => {
  const notify = useNotify();
  const onError = () => {
    notify("Image already exists!", { type: "error" });
  };
  return (
    <Edit title="Edit Image" mutationOptions={{ onError }}>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="name" />
        <TextInput source="content_type" disabled />
        <TextInput source="gridfs_id" disabled />
        <TextInput source="size" disabled />
        <ImageField source="admin_url" />
      </SimpleForm>
    </Edit>
  );
};
