import Head from "next/head";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { createNotification } from "@app/components/notifications";
import { Button, DeleteActionModal } from "@app/components/v2";
import { usePopUp } from "@app/hooks";

import { AddConsumerSecretModal } from "./ConsumerSecretsModal";
import { ConsumerSecretsTable } from "./ConsumerSecretsTable";
// import { useDeleteConsumerSecret } from "@app/hooks/api/consumerSecrets";

// import { AddConsumerSecretModal } from "./AddConsumerSecretModal";
// import { ConsumerSecretsTable } from "./ConsumerSecretsTable";

type DeleteModalData = { name: string; id: string };

export const ConsumerSecretsSection = () => {
  // const deleteConsumerSecret = useDeleteConsumerSecret();
  const { popUp, handlePopUpToggle, handlePopUpClose, handlePopUpOpen } = usePopUp([
    "createConsumerSecret",
    "deleteConsumerSecretConfirmation"
  ] as const);

  const onDeleteApproved = async () => {
    // try {
    //   await deleteConsumerSecret.mutateAsync({
    //     consumerSecretId: (popUp?.deleteConsumerSecretConfirmation?.data as DeleteModalData)?.id
    //   });
    //   createNotification({
    //     text: "Successfully deleted consumer secret",
    //     type: "success"
    //   });

    //   handlePopUpClose("deleteConsumerSecretConfirmation");
    // } catch (err) {
    //   console.error(err);
    //   createNotification({
    //     text: "Failed to delete consumer secret",
    //     type: "error"
    //   });
    // }
  };

  return (
    <div className="p-4 mb-6 border rounded-lg border-mineshaft-600 bg-mineshaft-900">
      <Head>
        <title>Consumer Secrets</title>
        <link rel="icon" href="/infisical.ico" />
        <meta property="og:image" content="/images/consumer-secrets.png" />
      </Head>
      <div className="flex justify-between mb-4">
        <p className="text-xl font-semibold text-mineshaft-100">Consumer Secrets</p>
        <Button
          colorSchema="primary"
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => {
            handlePopUpOpen("createConsumerSecret");
          }}
        >
          Add Consumer Secret
        </Button>
      </div>
      <ConsumerSecretsTable handlePopUpOpen={handlePopUpOpen} />
      <AddConsumerSecretModal popUp={popUp} handlePopUpToggle={handlePopUpToggle} />
      <DeleteActionModal
        isOpen={popUp.deleteConsumerSecretConfirmation.isOpen}
        title={`Delete ${
          (popUp?.deleteConsumerSecretConfirmation?.data as DeleteModalData)?.name || " "
        } consumer secret?`}
        onChange={(isOpen) => handlePopUpToggle("deleteConsumerSecretConfirmation", isOpen)}
        deleteKey={(popUp?.deleteConsumerSecretConfirmation?.data as DeleteModalData)?.name}
        onClose={() => handlePopUpClose("deleteConsumerSecretConfirmation")}
        onDeleteApproved={onDeleteApproved}
      />
    </div>
  );
};
