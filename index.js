// npm init
// npm install tonweb
// touch package.json ==> "type": "module",
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
import TonWeb from "tonweb";

const tonweb = new TonWeb();

const seed = TonWeb.utils.hexToBytes('607cdaf518cd38050b536005bea2667d008d5dda1027f9549479f4a42ac315c4');

const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);

const publicKey = keyPair.publicKey;
const secretKey = keyPair.secretKey;
console.log('wallet public key = ', TonWeb.utils.bytesToHex(publicKey));
console.log('wallet secretKey key = ', TonWeb.utils.bytesToHex(secretKey));

const wallet = tonweb.wallet.create({publicKey});

const address = await wallet.getAddress();

/**
 * Deploy The Wallet
 * @returns {Promise<void>}
 */
const deployWallet = async () => {
    await sleep(1000);
    await wallet.deploy(secretKey).send(); // deploy wallet to blockchain
}

/**
 * Get Transaction Fee
 * @returns {Promise<any>}
 */
const getTransactionFee = async () => {
    await sleep(1000);
    return await wallet.methods.transfer({
        secretKey,
        toAddress: 'EQDjVXa_oltdBP64Nc__p397xLCvGm2IcZ1ba7anSW0NAkeP',
        amount: TonWeb.utils.toNano("0.01"), // 0.01 TON
        seqno: seqno,
        payload: 'Hello',
        sendMode: 3,
    }).estimateFee();
}
/**
 * Get Transactions
 * @returns {Promise<any>}
 */
const getTransactions = async () => {
    await sleep(1000);
    return await tonweb.getTransactions(address);
}
/**
 * Get Balance
 * @returns {Promise<string>}
 */
const getBalance = async () => {
    await sleep(1000);
    return await tonweb.getBalance(address)
}
/**
 * Send Boc
 * @returns {Promise<any>}
 * @param bocBytes
 */
const sendBoc = async (bocBytes) => {
    console.log(bocBytes)
  await sleep(1000);
  return await tonweb.sendBoc(bocBytes);
}


const nonBounceableAddress = address.toString(true, true, false);

const seqno = await wallet.methods.seqno().call();

console.log('nonBounceableAddress ===================== \n', nonBounceableAddress);
console.log('seqno = \n', seqno);

await deployWallet();

const fee = await getTransactionFee();

console.log('fee ====================== \n', fee);


const Cell = TonWeb.boc.Cell;
const cell = new Cell();
cell.bits.writeUint(0, 32);
cell.bits.writeAddress(address);
cell.bits.writeGrams(1);
console.log("Print the Cell =====================:\n ",cell.print()); // print cell data like Fift
const bocBytes = cell.toBoc();

const history = await getTransactions();

const balance = await getBalance();

console.log("History =====================:\n ",history);
console.log("Balance =====================:\n ", balance);

const res = await sendBoc(bocBytes);

console.log("Send Boc Res =====================:\n ",res);
