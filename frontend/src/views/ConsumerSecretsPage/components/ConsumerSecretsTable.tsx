import { useState } from "react";
import { faKey } from "@fortawesome/free-solid-svg-icons";

import {
  EmptyState,
  Pagination,
  Table,
  TableContainer,
  TableSkeleton,
  TBody,
  Th,
  THead,
  Tr
} from "@app/components/v2";
import { useGetConsumerSecrets } from "@app/hooks/api/consumerSecerts";
import { UsePopUpState } from "@app/hooks/usePopUp";

import { ConsumerSecretsRow } from "./ConsumerSecertsRow";



type Props = {
  handlePopUpOpen: (
    popUpName: keyof UsePopUpState<["deleteConsumerSecretConfirmation"]>,
    {
      name,
      id
    }: {
      name: string;
      id: string;
    }
  ) => void;
};

export const ConsumerSecretsTable = ({ handlePopUpOpen }: Props) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { isLoading, data } = useGetConsumerSecrets({
    offset: (page - 1) * perPage,
    limit: perPage
  });

  console.log("data =>", data);
  
  return (
    <TableContainer>
      <Table>
        <THead>
          <Tr>
            <Th className="w-5" />
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Created At</Th>
            <Th>Last Updated</Th>
            <Th aria-label="button" className="w-5" />
          </Tr>
        </THead>
        <TBody>
          {isLoading && <TableSkeleton columns={6} innerKey="consumer-secrets" />}
          {!isLoading &&
            data?.secrets?.map((row) => (
              <ConsumerSecretsRow key={row.id} row={row} handlePopUpOpen={handlePopUpOpen} />
            ))}
        </TBody>
      </Table>
      {!isLoading &&
        data?.secrets &&
        data?.totalCount >= perPage &&
        data?.totalCount !== undefined && (
          <Pagination
            count={data.totalCount}
            page={page}
            perPage={perPage}
            onChangePage={(newPage) => setPage(newPage)}
            onChangePerPage={(newPerPage) => setPerPage(newPerPage)}
          />
        )}
      {!isLoading && !data?.secrets?.length && (
        <EmptyState title="No consumer secrets found" icon={faKey} />
      )}
    </TableContainer>
  );
};
