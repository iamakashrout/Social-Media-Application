import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

function UserImage() {
const dispatch = useDispatch();
   const {picturePath } = useSelector((state) => state.user);
    return (
    <Box width={100} height={100}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={100}
        height={100}
        alt="user"
        src={`http://localhost:5000/assets/${picturePath}`}
      />
    </Box>
  );
}


export default UserImage;