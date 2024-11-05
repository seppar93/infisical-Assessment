import { faKey, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

import { IconButton, Td, Tooltip, Tr } from "@app/components/v2";
import { Badge } from "@app/components/v2/Badge";
import { TConsumerSecret } from "@app/hooks/api/consumerSecerts/types";
import { UsePopUpState } from "@app/hooks/usePopUp";

export const ConsumerSecretsRow = ({
  row,
  handlePopUpOpen
}: {
  row: TConsumerSecret;
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
}) => {
  const createdAt = format(new Date(row.createdAt), "yyyy-MM-dd - HH:mm a");
  const updatedAt = format(new Date(row.updatedAt), "yyyy-MM-dd - HH:mm a");

  return (
    <Tr key={row.id}>
      <Td>
        <Tooltip content="Consumer Secret">
          <FontAwesomeIcon icon={faKey} />
        </Tooltip>
      </Td>
      <Td>{row.name || "-"}</Td>
      <Td>
        <Badge variant="info">{row.credential_type}</Badge>
      </Td>
      <Td>{createdAt}</Td>
      <Td>{updatedAt}</Td>
      <Td>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handlePopUpOpen("deleteConsumerSecretConfirmation", {
              name: row.name,
              id: row.id
            });
          }}
          variant="plain"
          ariaLabel="delete"
        >
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>
      </Td>
    </Tr>
  );
};
