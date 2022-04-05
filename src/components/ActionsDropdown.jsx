import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";

const ActionsDropdown = (
  <Popover id="popover-basic" className="popover-bg w-[12vw]">
    <Popover.Body className="flex flex-col p-0 rounded-sm">
      <p className="pb-2 px-2 pt-3 cursor-pointer text-white text-center">
        Set Alert
      </p>
      <p className="pb-2 px-2 cursor-pointer text-white text-center">
        Portfolio
      </p>
    </Popover.Body>
  </Popover>
);
export default ActionsDropdown;
