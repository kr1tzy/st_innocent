import { stringify } from "query-string";

//console.log("REACT_APP_BASE_URL: ", process.env.REACT_APP_BASE_URL);
const BASE_URL = process.env.REACT_APP_BASE_URL;

//
// HTTP client
//
export const httpClient = async (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = {};
  }

  if (!options.headers["Content-Type"]) {
    options.headers["Content-Type"] = "application/json";
  }

  options.headers["Accept"] = "application/json";
  options.headers["Origin"] = window.location.origin;

  const tokenString: string = localStorage.getItem("token") || "";
  if (tokenString.length > 0) {
    const token = JSON.parse(tokenString);
    options.headers["Authorization"] = `Bearer ${token.access_token}`;
  }

  //console.log("admin.httpClient", url, JSON.stringify(options, null, 2));

  const response = await fetch(url, options);

  if (response.status === 401) {
    //console.log(`${response.status} - ${response.statusText} - logging out...`);
    await authProvider.logout();
  }

  return { json: await response.json() };
};

//
// Data API
//
export const dataProvider = {
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      _order: order,
      _field: field,
      _range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      _filter: JSON.stringify(params.filter),
    };
    const url = `${BASE_URL}/${resource}?${stringify(query)}`;
    return httpClient(url)
      .then(({ json }) => json)
      .catch((err) => err.body);
  },

  getOne: async (resource: string, params: any) => {
    const url = `${BASE_URL}/${resource}/${params.id}`;
    return httpClient(url)
      .then(({ json }) => json)
      .catch((err) => err.body);
  },
  getMany: async (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${BASE_URL}/${resource}?${stringify(query)}`;
    return httpClient(url)
      .then(({ json }) => json)
      .catch((err) => err.body);
  },

  getManyReference: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${BASE_URL}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => json);
  },

  update: async (resource: string, params: any) => {
    const url = `${BASE_URL}/${resource}/${params.id}`;
    return httpClient(url, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => json);
  },

  updateMany: async (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${BASE_URL}/${resource}?${stringify(query)}`;
    return httpClient(url, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => json);
  },

  create: async (resource: string, params: any) => {
    const url = `${BASE_URL}/${resource}`;
    return httpClient(url, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => json);
  },

  delete: async (resource: string, params: any) => {
    const url = `${BASE_URL}/${resource}/${params.id}`;
    return httpClient(url, {
      method: "DELETE",
    }).then(({ json }) => json);
  },

  deleteMany: async (resource: string, params: any) => {
    let query = "";
    for (let i = 0, len = params.ids.length; i < len; i++) {
      let id = params.ids[i];
      query += i !== params.ids.length - 1 ? `ids=${id}&` : `ids=${id}`;
    }
    const url = `${BASE_URL}/${resource}?${query}`;
    return httpClient(url, {
      method: "DELETE",
    }).then(({ json }) => json);
  },
  uploadImage: async (image: File) => {
    const url = `${BASE_URL}/images/upload`;
    let formData = new FormData();
    formData.append("uploaded_image", image);
    return httpClient(url, {
      method: "POST",
      body: formData,
    }).then((res) => res.json);
  },
  getAnalytics: async () => {
    const url = `${BASE_URL}/analytics`;
    return httpClient(url, {
      method: "GET",
    }).then((res) => res.json);
  },
  getInquiries: async () => {
    const url = `${BASE_URL}/inquiries`;
    return httpClient(url, {
      method: "GET",
    }).then((res) => res.json);
  },
  inquiryFollowUp: async (id: string) => {
    const url = `${BASE_URL}/inquiries/done?inquiry_id=${id}`;
    return httpClient(url, {
      method: "PUT",
    }).then((res) => res.json);
  },
};

//
// Auth API
//
export const authProvider = {
  login: ({ username, password }: { username: string; password: string }) => {
    if (username.length === 0) {
      username = " ";
    }
    if (password.length === 0) {
      password = " ";
    }
    const url = `${BASE_URL}/token`;
    const options = {
      method: "POST",
      body: [
        encodeURIComponent("username") + "=" + encodeURIComponent(username),
        encodeURIComponent("password") + "=" + encodeURIComponent(password),
      ].join("&"),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    return httpClient(url, options)
      .then(({ json }) => {
        //console.log("json: ", json);
        if (json.access_token) {
          localStorage.setItem("token", JSON.stringify(json));
          return Promise.resolve(json);
        } else {
          return Promise.reject({ body: json });
        }
      })
      .catch((err) => {
        //console.log("err: ", err);
        return Promise.reject({ ...err, message: false });
      });
  },
  logout: () => {
    localStorage.removeItem("token");
    window.location.href = `${window.location.origin}/#/login`;
    return Promise.resolve();
  },

  checkAuth: () => {
    const url = `${BASE_URL}/token/check`;
    return httpClient(url)
      .then(() => {
        return Promise.resolve();
      })
      .catch((err) => {
        return Promise.reject({ ...err, message: err.body.detail });
      });
  },

  checkError: (error: any) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },
};
