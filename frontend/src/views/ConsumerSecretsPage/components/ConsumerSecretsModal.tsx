import { Modal, ModalContent } from "@app/components/v2";
import { UsePopUpState } from "@app/hooks/usePopUp";

import { ConsumerSecretForm } from "./ConsumerSecretsForm";


type Props = {
  popUp: UsePopUpState<["createConsumerSecret"]>;
  handlePopUpToggle: (
    popUpName: keyof UsePopUpState<["createConsumerSecret"]>,
    state?: boolean
  ) => void;
};

export const AddConsumerSecretModal = ({ popUp, handlePopUpToggle }: Props) => {
  return (
    <Modal
      isOpen={popUp?.createConsumerSecret?.isOpen}
      onOpenChange={(isOpen) => {
        handlePopUpToggle("createConsumerSecret", isOpen);
      }}
    >
      <ModalContent
        title="Add a Consumer Secret"
        subTitle="Once you add a secret, it can be securely stored and accessed later."
      >
        <ConsumerSecretForm
          credentialType={(popUp.createConsumerSecret.data as { credentialType?: string })?.credentialType}
        />
      </ModalContent>
    </Modal>
  );
};
