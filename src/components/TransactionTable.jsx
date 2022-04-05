import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { HiOutlineSelector } from "react-icons/hi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ActionsDropdown from "./ActionsDropdown";

// store table data in a piece of state --DONE
// create function that gets executed to update  state with 25 more items
// put in check to disable button if reached all 1000 items
// when user clicks column to sort, clear state and get 25 items with new sort
// also make sure to set piece of state for sort type -- DONE

const TransactionTable = () => {
  const [tableD, setTableD] = useState([]);
  const [sortType, setSortType] = useState(null);
  const [show, setShow] = useState(0);
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    const getData = async () => {
      const tableData = await fetch(
        "https://nftcheese-dev-api.herokuapp.com/?type=rank&order=asc&start=0&end=25"
      )
        .then((res) => res.json())
        .catch((err) => console.warn(err.message));
      setTableD(tableData);
    };
    getData();
  }, []);

  const sortData = (type, orderType) => {
    setOrder(orderType);
    setTimeout(async () => {
      setTableD([]);
      const tableData = await fetch(
        `https://nftcheese-dev-api.herokuapp.com/?type=${type}&order=${orderType}&start=0&end=${tableD.length}`
      )
        .then((res) => res.json())
        .catch((err) => console.warn(err.message));
      setTableD(tableData);
    }, 1000);
  };

  const showMore = async (total, orderType) => {
    setOrder(orderType);
    setTimeout(async () => {
      const tableData = await fetch(
        `https://nftcheese-dev-api.herokuapp.com/?type=rank&order=${orderType}&start=${
          total * 25 + 1
        }&end=${25 * (total + 1)}`
      )
        .then((res) => res.json())
        .catch((err) => console.warn(err.message));
      if (orderType === "asc") {
        setTableD([...tableD, ...tableData]);
      } else {
        setTableD([...tableData, ...tableD]);
      }
    }, 1000);
  };

  return (
    <div className="text-white mt-24 flex flex-col justify-center">
      <Table>
        <thead className="text-white">
          <tr>
            <th
              className="text-center p-4 cursor-pointer"
              onClick={() => {
                sortData("rank", order === "asc" ? "desc" : "asc");
              }}
            >
              <span>Rank</span>
              <HiOutlineSelector className="inline-block ml-1" />
            </th>
            <th className="text-center p-4">Address</th>
            <th
              className="text-center p-4 cursor-pointer"
              onClick={() => {
                setOrder(order === "asc" ? "desc" : "asc");
                sortData("flipsCount", order === "asc" ? "desc" : "asc");
              }}
            >
              <span>No. Flips</span>
              <HiOutlineSelector className="inline-block ml-1" />
            </th>
            <th
              className="text-center p-4 cursor-pointer"
              onClick={() => {
                setOrder(order === "asc" ? "desc" : "asc");
                sortData("transactionCount", order === "asc" ? "desc" : "asc");
              }}
            >
              <span>No. Transactions</span>
              <HiOutlineSelector className="inline-block ml-1" />
            </th>
            <th className="text-center p-4">Total Gain</th>
            <th className="text-center p-4">Balance</th>
            <th className="text-center p-4">Compare Floor Price</th>
            <th className="text-center p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {tableD.length > 0 &&
            tableD?.map((val, i) => (
              <tr key={i} className="tb-border">
                <td className="p-4 text-center">{val?.rank?.N}</td>
                <td className="p-4 text-center">
                  {val?.wallet?.S.slice(0, 9)}
                </td>
                <td className="p-4 text-center">{val?.flipsCount?.N}</td>
                <td className="p-4 text-center">{val?.transactionCount?.N}</td>
                <td className="p-4 text-center">{val?.totalGain?.N}</td>
                <td className="p-4 text-center">{val?.balance?.N}</td>
                <td className="p-4 text-center">{val?.compareFloor?.N}%</td>
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  overlay={ActionsDropdown}
                  rootClose
                >
                  <td className="p-4 flex justify-center cursor-pointer">
                    <FiMoreHorizontal />
                  </td>
                </OverlayTrigger>
              </tr>
            ))}
        </tbody>
      </Table>
      <Button
        type="button"
        variant="danger"
        className="mt-2"
        onClick={() => showMore(tableD.length / 25, order)}
      >
        Show 25 more items
      </Button>
    </div>
  );
};
export default TransactionTable;
