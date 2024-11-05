import { ConsumerSecretsSection } from "./components/ConsumerSecretsSection";

export const ConsumerSecretsPage = () => {
  return (
    <div className="container w-full h-full px-6 mx-auto text-white max-w-7xl bg-bunker-800">
      <div className="flex items-center justify-between py-6">
        <div className="flex flex-col w-full">
          <h2 className="text-3xl font-semibold text-gray-200">Consumer Sharing</h2>
          <p className="text-bunker-300">Store your information securely </p>
        </div>
        <div className="flex justify-center w-max">TEST</div>
      </div>
      <ConsumerSecretsSection />
    </div>
  );
};
