import { Grid, Typography, Avatar } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface IUsers {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  picture: string;
}
const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUsers | any>([]);
  const [isloading, setLoading] = useState<boolean>(false);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/getUsers`);
      if (!!res) {
        setLoading(false);
        setUsers(res.data.data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    setLoading(true);
    getUsers();
  }, []);

  const onUserDelete = async (id: string) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/deleteuser/${id}`
      );
      if (res && res.data.success) {
        getUsers();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  const rows = users.map((user: any, key: any) => ({
    id: key + 1,
    userId: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    picture: (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <Avatar
        src={`${process.env.REACT_APP_API}/${user?.picture}`}
        alt="User"
        // sx={{ height: "100%", width: "100%" }}
      />
    ),
    actions: user.actions,
  }));

  const columns: any = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "header",
      description: "ID",
      flex: 0,
    },
    {
      field: "picture",
      headerName: "Picture",
      headerClassName: "header",
      description: "Picture",
      renderCell: (params: any) => params.value,
      flex: 0.6,
      editable: true,
    },
    {
      field: "firstname",
      headerName: "Firstname",
      headerClassName: "header",
      description: "Firstname",
      flex: 0.8,
      editable: true,
    },
    {
      field: "lastname",
      headerName: "Lastname",
      headerClassName: "header",
      description: "Lastname",
      flex: 0.8,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "header",
      description: "Email",
      flex: 1.5,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      headerClassName: "header",
      description: "Contact",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "header",
      description: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<Visibility color={"primary"} />}
          label="Delete"
          onClick={() =>
            params.row.userId &&
            navigate(`/users/view-user/${params.row.userId}`)
          }
        />,
        <GridActionsCellItem
          icon={<Delete color={"error"} />}
          label="Delete"
          onClick={() => onUserDelete(params.row.userId)}
        />,
        <GridActionsCellItem
          icon={<Edit color="info" />}
          label="Edit"
          onClick={() => navigate(`/users/update-user/${params.row.userId}`)}
        />,
      ],
    },
  ];
  return (
    <>
      <Grid container padding={2}>
        <Typography
          className="font"
          color="black"
          variant="h3"
          paddingBottom={3}
        >
          Users
        </Typography>
        {!isloading ? (
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
            xs={12}
          >
            {users.length > 0 ? (
              <Grid item lg={12} sm={12} xs={11}>
                <DataGrid
                  columns={columns}
                  rows={rows}
                  // rowHeight={70}
                  // getRowHeight={() => "auto"}
                  // getEstimatedRowHeight={() => 200}
                  initialState={{
                    ...users.initialState,
                    pagination: { paginationModel: { pageSize: 7 } },
                  }}
                  pageSizeOptions={[7, 10, 25]}
                  sx={{ background: "#a9a9a914" }}
                  slots={{ toolbar: GridToolbar }}
                />
              </Grid>
            ) : (
              <Typography variant="h5" color="error">
                No Data Found
              </Typography>
            )}
          </Grid>
        ) : (
          <div style={{ height: "100%", width: "100%" }}>
            <Loader />
          </div>
        )}
      </Grid>
    </>
  );
};

export default Users;
