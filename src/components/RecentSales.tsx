import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

export const RecentSales = () => {
  return (
    <div className="overflow-x-auto">
      <Table striped>
        <TableHead>
          <TableRow>
            <TableHeadCell>Fecha</TableHeadCell>
            <TableHeadCell>Cliente</TableHeadCell>
            {/* <TableHeadCell>Id</TableHeadCell> */}
            <TableHeadCell>Total</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          <TableRow className="bg-white  ">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 ">
              Apple MacBook Pro 17"
            </TableCell>
            <TableCell>Sliver</TableCell>

            <TableCell>$2999</TableCell>
            <TableCell>
              {/* <a href="#" className="font-medium text-primary-600 ">
                Edit
              </a> */}
              <Button size="xs">Detalles</Button>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white ">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 ">
              Microsoft Surface Pro
            </TableCell>
            <TableCell>White</TableCell>
            {/* <TableCell>Laptop PC</TableCell> */}
            <TableCell>$1999</TableCell>
            <TableCell>
              <Button size="xs">Detalles</Button>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white ">
            <TableCell className="whitespace-nowrap font-medium  ">
              Magic Mouse 2
            </TableCell>
            <TableCell>Black</TableCell>
            {/* <TableCell>Accessories</TableCell> */}
            <TableCell>$99</TableCell>
            <TableCell>
              <Button size="xs">Detalles</Button>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white ">
            <TableCell className="whitespace-nowrap font-medium  ">
              Magic Mouse 2
            </TableCell>
            <TableCell>Black</TableCell>
            {/* <TableCell>Accessories</TableCell> */}
            <TableCell>$99</TableCell>
            <TableCell>
              <Button size="xs">Detalles</Button>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white ">
            <TableCell className="whitespace-nowrap font-medium  ">
              Magic Mouse 2
            </TableCell>
            <TableCell>Black</TableCell>
            {/* <TableCell>Accessories</TableCell> */}
            <TableCell>$99</TableCell>
            <TableCell>
              <Button size="xs">Detalles</Button>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white ">
            <TableCell className="whitespace-nowrap font-medium  ">
              Magic Mouse 2
            </TableCell>
            <TableCell>Black</TableCell>
            {/* <TableCell>Accessories</TableCell> */}
            <TableCell>$99</TableCell>
            <TableCell>
              <Button size="xs">Detalles</Button>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white ">
            <TableCell className="whitespace-nowrap font-medium  ">
              Magic Mouse 2
            </TableCell>
            <TableCell>Black</TableCell>
            {/* <TableCell>Accessories</TableCell> */}
            <TableCell>$99</TableCell>
            <TableCell>
              <Button size="xs">Detalles</Button>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white ">
            <TableCell className="whitespace-nowrap font-medium  ">
              Magic Mouse 2
            </TableCell>
            <TableCell>Black</TableCell>
            {/* <TableCell>Accessories</TableCell> */}
            <TableCell>$99</TableCell>
            <TableCell>
              <Button size="xs">Detalles</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
