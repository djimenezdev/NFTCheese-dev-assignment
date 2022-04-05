import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import TransactionTable from "./components/TransactionTable";
import WalletGraph from "./components/WalletGraph";

function App() {
  return (
    <div className="App bg-[#000] min-h-screen w-screen px-6 flex flex-col items-center">
      <header className="App-header flex justify-center">
        <h1 className="text-red-500 text-6xl mt-3 font">
          NFT Cheese Dev Assigment
        </h1>
      </header>
      <main className="h-[40vh] w-[70vw] mt-10">
        <ParentSize>
          {({ width, height }) => <WalletGraph width={width} height={height} />}
        </ParentSize>
      </main>
      <TransactionTable />
    </div>
  );
}

export default App;
