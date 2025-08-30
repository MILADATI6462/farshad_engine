cd C:\Users\Milad\Desktop
npx create-expo-app farshad-engine
cd farshad-engine
npm install
npm install firebase ethers expo-notifications expo-secure-store
npm install @react-navigation/native @react-navigation/native-stack
farshad-engine/
├── App.js
├── firebaseConfig.js
├── scanner.js
├── engineMonitor.js
├── walletUtils.js
├── screens/
│   ├── DashboardScreen.js
│   ├── NotificationCenter.js
│   └── EngineControlScreen.js
├── components/
│   └── WalletCard.jsimport bip39 from 'bip39';

export function generateValidMnemonics(wordList, maxCount = 1000) {
  const validMnemonics = [];

  for (let i = 0; i < maxCount; i++) {
    const mnemonic = bip39.generateMnemonic();
    if (bip39.validateMnemonic(mnemonic)) {
      validMnemonics.push(mnemonic);
    }
  }

  return validMnemonics;
}
import bip39 from 'bip39';

export function generateValidMnemonics(count = 1000) {
  const validMnemonics = [];

  for (let i = 0; i < count; i++) {
    const mnemonic = bip39.generateMnemonic();
    if (bip39.validateMnemonic(mnemonic)) {
      validMnemonics.push(mnemonic);
    }
  }

  return validMnemonics;
}import { ethers } from 'ethers';
import axios from 'axios';

export async function checkEthBalance(address) {
  const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY');
  const balance = await provider.getBalance(address);
  return parseFloat(ethers.formatEther(balance));
}

export async function checkBtcBalance(address) {
  const res = await axios.get(`https://blockchain.info/q/addressbalance/${address}`);
  return res.data / 1e8;
}import axios from 'axios';

export async function getValuableNFTs(address) {
  const res = await axios.get(`https://eth-mainnet.g.alchemy.com/nft/v2/YOUR_API_KEY/getNFTs?owner=${address}`);
  const nfts = res.data.ownedNfts || [];

  return nfts.filter(nft => {
    const price = nft.floorPrice?.usd || 0;
    return price > 10;
  });
}import nodemailer from 'nodemailer';

export async function sendReport(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your.email@gmail.com',
      pass: 'your_app_password'
    }
  });

  await transporter.sendMail({
    from: 'your.email@gmail.com',
    to,
    subject,
    text
  });
}import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>فرشاد | موتور جستجوی کیف پول</Text>
      <Text style={styles.subtitle}>عبارت بازیابی خود را وارد کنید تا بررسی آغاز شود</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, color: '#555' }
});C:\Users\Milad\Desktop\ferhsad-engine
mkdir farshad-wallet
cd farshad-wallet
npm init -y
npm install bip39 axios ethers bitcoinjs-lib @solana/web3.js nodemailer
code index.js
console.log("فرشاد آماده‌ی اجراست 💥");
mnemonicEngine.js
const bip39 = require('bip39');
const ethers = require('ethers');

function generateMnemonic() {
  return bip39.generateMnemonic();
}

function deriveEthAddress(mnemonic) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  return wallet.address;
}

module.exports = { generateMnemonic, deriveEthAddress };
const { generateMnemonic, deriveEthAddress } = require('./mnemonicEngine');

const mnemonic = generateMnemonic();
const address = deriveEthAddress(mnemonic);

console.log("Mnemonic:", mnemonic);
console.log("ETH Address:", address);
const axios = require('axios');

async function checkEthBalance(address) {
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKey`;
  const res = await axios.get(url);
  const balance = parseFloat(res.data.result) / 1e18;
  return balance;
}

async function checkBtcBalance(address) {
  const url = `https://blockchain.info/q/addressbalance/${address}`;
  const res = await axios.get(url);
  const balance = parseFloat(res.data) / 1e8;
  return balance;
}

module.exports = { checkEthBalance, checkBtcBalance };
const { checkEthBalance, checkBtcBalance } = require('./checkBalance');

(async () => {
  const ethBalance = await checkEthBalance(ethWallet.address);
  const btcBalance = await checkBtcBalance(btcAddress);

  console.log("ETH Balance:", ethBalance);
  console.log("BTC Balance:", btcBalance);
})();
const btcAddress = deriveWallets(mnemonic).btc;
const ethAddress = deriveWallets(mnemonic).eth;
async function checkETHBalance(address) {
  try {
    const url = `...`;
    const res = await axios.get(url);
    return parseFloat(res.data.result) / 1e18;
  } catch (err) {
    console.error("ETH Balance Error:", err.message);
    return 0;
  }
}
// index.js
const { generateMnemonic, deriveWallets } = require('./mnemonicEngine');
const { checkBTCBalance, checkETHBalance } = require('./checkBalance');

(async () => {
  const mnemonic = generateMnemonic();
  console.log("🔑 Mnemonic:", mnemonic);

  const wallets = deriveWallets(mnemonic);
  console.log("🪙 ETH Address:", wallets.eth);
  console.log("🪙 BTC Address:", wallets.btc);
  console.log("🪙 SOL Address:", wallets.sol);

  const ethBalance = await checkETHBalance(wallets.eth);
  const btcBalance = await checkBTCBalance(wallets.btc);

  console.log("💰 ETH Balance:", ethBalance);
  console.log("💰 BTC Balance:", btcBalance);
})();function deriveWallets(mnemonic) {
  const ethWallet = ethers.Wallet.fromMnemonic(mnemonic);
  const ethAddress = ethWallet.address;

  const btcSeed = bip39.mnemonicToSeedSync(mnemonic);
  const btcRoot = bitcoin.bip32.fromSeed(btcSeed);
  const btcChild = btcRoot.derivePath("m/44'/0'/0'/0/0");
  const btcAddress = bitcoin.payments.p2pkh({ pubkey: btcChild.publicKey }).address;

  const solKeypair = solanaWeb3.Keypair.fromSeed(btcSeed.slice(0, 32));
  const solAddress = solKeypair.publicKey.toBase58();

  return {
    eth: ethAddress,
    btc: btcAddress,
    sol: solAddress
  };
}
async function scanWallets(mnemonic) {
  const wallets = deriveWallets(mnemonic);
  const balances = {};

  balances.eth = await checkETHBalance(wallets.eth);
  balances.btc = await checkBTCBalance(wallets.btc);
  // اضافه کردن بلاک‌چین‌های دیگه مثل BNB, Polygon, Solana, Tron...

  return { wallets, balances };
}// walletScanner.js
const { generateMnemonic, deriveWallets } = require('./mnemonicEngine');
const { checkBTCBalance, checkETHBalance } = require('./checkBalance');

async function scanWallets() {
  const mnemonic = generateMnemonic();
  const wallets = deriveWallets(mnemonic);

  const balances = {};
  balances.eth = await checkETHBalance(wallets.eth);
  balances.btc = await checkBTCBalance(wallets.btc);

  return {
    mnemonic,
    wallets,
    balances
  };
}

module.exports = { scanWallets };
const { scanWallets } = require('./walletScanner');

(async () => {
  const result = await scanWallets();

  console.log("🔑 Mnemonic:", result.mnemonic);
  console.log("🪙 ETH:", result.wallets.eth, "| 💰", result.balances.eth);
  console.log("🪙 BTC:", result.wallets.btc, "| 💰", result.balances.btc);
  console.log("🪙 SOL:", result.wallets.sol); // موجودی سولانا رو بعداً اضافه می‌کنیم
})();// balanceFilter.js

function filterValuableWallets(walletsWithBalances, threshold = 10) {
  return walletsWithBalances.filter(wallet => {
    const totalBalance = (wallet.balance.eth || 0) + (wallet.balance.btc || 0);
    return totalBalance >= threshold;
  });
}

module.exports = { filterValuableWallets };
const { filterValuableWallets } = require('./balanceFilter');

(async () => {
  const result = await scanWallets();

  console.log("🔍 All Wallets:", result);

  const filtered = filterValuableWallets([
    {
      wallet: result.wallets.eth,
      balance: { eth: result.balances.eth, btc: result.balances.btc }
    }
  ]);

  console.log("💎 Valuable Wallets:", filtered);
})();// nftScanner.js
const axios = require('axios');

async function getEthereumNFTs(address) {
  try {
    const url = `https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&limit=50`;
    const res = await axios.get(url);
    const nfts = res.data.assets.map(nft => ({
      name: nft.name,
      tokenId: nft.token_id,
      collection: nft.collection.name,
      estimatedValue: nft.last_sale?.total_price ? parseFloat(nft.last_sale.total_price) / 1e18 : 0
    }));
    return nfts;
  } catch (err) {
    console.error("❌ NFT Scan Error:", err.message);
    return [];
  }
}

module.exports = { getEthereumNFTs };
const { getEthereumNFTs } = require('./nftScanner');

(async () => {
  const result = await scanWallets();

  console.log("🔑 Mnemonic:", result.mnemonic);
  console.log("🪙 ETH:", result.wallets.eth, "| 💰", result.balances.eth);
  console.log("🪙 BTC:", result.wallets.btc, "| 💰", result.balances.btc);

  const nfts = await getEthereumNFTs(result.wallets.eth);
  console.log("🎨 NFTs:", nfts);
})();const axios = require('axios');
const ETH_SCAN_API_KEY = 'your_api_key_here'; // جایگزین کن

async function getWalletTransactions(address) {
  const res = await axios.get(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETH_SCAN_API_KEY}`
  );
  if (res.data.status !== "1") {
    console.error("ETH Scan Error:", res.data.message);
    return [];
  }
  return res.data.result;
}

async function analyzeEthereumWallet(address) {
  const txns = await getWalletTransactions(address);
  const result = {
    balance: 0,
    txns: []
  };

  txns.forEach(txn => {
    const value = Number(txn.value);
    if (txn.to.toLowerCase() === address.toLowerCase()) {
      result.balance += value;
    } else if (txn.from.toLowerCase() === address.toLowerCase()) {
      result.balance -= value;
    }
    result.txns.push(txn);
  });

  result.balance = result.balance / 1e18;
  return result;
}

module.exports = { analyzeEthereumWallet };
const { analyzeEthereumWallet } = require('./ethAnalyzer');

(async () => {
  const result = await scanWallets();
  const ethReport = await analyzeEthereumWallet(result.wallets.eth);

  console.log("📊 ETH Wallet Report:");
  console.log("Balance:", ethReport.balance);
  console.log("Transactions:", ethReport.txns.length);
})();npm install firebase
// cloudSync.js
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function uploadWalletReport(report) {
  const timestamp = Date.now();
  const path = `reports/${timestamp}`;
  await set(ref(db, path), report);
  console.log("✅ Uploaded to Firebase:", path);
}

module.exports = { uploadWalletReport };
const { uploadWalletReport } = require('./cloudSync');

(async () => {
  const result = await scanWallets();
  const ethReport = await analyzeEthereumWallet(result.wallets.eth);
  const nfts = await getEthereumNFTs(result.wallets.eth);

  const fullReport = {
    mnemonic: result.mnemonic,
    wallets: result.wallets,
    balances: result.balances,
    ethReport,
    nfts
  };

  await uploadWalletReport(fullReport);
})();npm install nodemailer
// reportSender.js
const nodemailer = require('nodemailer');

async function sendReportEmail(report, toEmail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password' // از Gmail App Password استفاده کن
    }
  });

  const message = {
    from: 'فرشاد‌والت <your_email@gmail.com>',
    to: toEmail,
    subject: '📊 گزارش کیف پول فرشاد',
    text: JSON.stringify(report, null, 2)
  };

  await transporter.sendMail(message);
  console.log("📨 ایمیل ارسال شد به:", toEmail);
}

module.exports = { sendReportEmail };
const { sendReportEmail } = require('./reportSender');

(async () => {
  const result = await scanWallets();
  const ethReport = await analyzeEthereumWallet(result.wallets.eth);
  const nfts = await getEthereumNFTs(result.wallets.eth);

  const fullReport = {
    mnemonic: result.mnemonic,
    wallets: result.wallets,
    balances: result.balances,
    ethReport,
    nfts
  };

  await uploadWalletReport(fullReport); // فضای ابری
  await sendReportEmail(fullReport, 'your_email@gmail.com'); // ایمیل شخصی
})();// reportSender.js
const nodemailer = require('nodemailer');

async function sendReportEmail(report) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password' // از Google App Password استفاده کن
    }
  });

  const message = {
    from: 'فرشاد‌والت <your_email@gmail.com>',
    to: 'miladvatan085@gmail.com',
    subject: '📊 گزارش کیف پول فرشاد',
    text: JSON.stringify(report, null, 2)
  };

  await transporter.sendMail(message);
  console.log("📨 ایمیل ارسال شد به: miladvatan085@gmail.com");
}

module.exports = { sendReportEmail };
const { sendReportEmail } = require('./reportSender');

(async () => {
  const result = await scanWallets();
  const ethReport = await analyzeEthereumWallet(result.wallets.eth);
  const nfts = await getEthereumNFTs(result.wallets.eth);

  const fullReport = {
    mnemonic: result.mnemonic,
    wallets: result.wallets,
    balances: result.balances,
    ethReport,
    nfts
  };

  await uploadWalletReport(fullReport); // فضای ابری
  await sendReportEmail(fullReport);    // ارسال ایمیل
})();// scannerWorker.js
const { parentPort, workerData } = require('worker_threads');
const { scanWallets } = require('./walletScanner');

(async () => {
  const result = await scanWallets(workerData.seed);
  parentPort.postMessage(result);
})();const { Worker } = require('worker_threads');

function runScanner(seed) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./scannerWorker.js', {
      workerData: { seed }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

(async () => {
  const seeds = Array.from({ length: 10 }, () => Math.random().toString()); // تست با 10 کیف
  const results = await Promise.all(seeds.map(runScanner));

  console.log("📊 Parallel Scan Results:");
  results.forEach((r, i) => {
    console.log(`Wallet ${i + 1}:`, r.wallets.eth, "| 💰", r.balances.eth);
  });
})();npm install blessed chalk
// cliDashboard.js
const blessed = require('blessed');
const chalk = require('chalk');

function showDashboard(walletReports) {
  const screen = blessed.screen({
    smartCSR: true,
    title: '📊 داشبورد فرشاد'
  });

  const box = blessed.box({
    top: 'center',
    left: 'center',
    width: '90%',
    height: '90%',
    content: '',
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: '#f0f0f0' }
    }
  });

  walletReports.forEach((report, i) => {
    const eth = chalk.green(`${report.wallets.eth}`);
    const btc = chalk.yellow(`${report.wallets.btc}`);
    const sol = chalk.cyan(`${report.wallets.sol}`);
    const balance = chalk.magenta(`ETH: ${report.balances.eth} | BTC: ${report.balances.btc}`);
    box.content += `\n${chalk.bold(`Wallet ${i + 1}`)}\n${eth}\n${btc}\n${sol}\n${balance}\n`;
  });

  screen.append(box);
  screen.render();

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
}

module.exports = { showDashboard };
const { showDashboard } = require('./cliDashboard');

(async () => {
  const seeds = Array.from({ length: 5 }, () => Math.random().toString());
  const results = await Promise.all(seeds.map(runScanner));

  showDashboard(results);
})();npm install express
// server.js
const express = require('express');
const { scanWallets } = require('./walletScanner');
const { analyzeEthereumWallet } = require('./ethAnalyzer');
const { getEthereumNFTs } = require('./nftScanner');
const { filterValuableWallets } = require('./balanceFilter');

const app = express();
const PORT = 3000;

app.get('/scan', async (req, res) => {
  try {
    const result = await scanWallets();
    const ethReport = await analyzeEthereumWallet(result.wallets.eth);
    const nfts = await getEthereumNFTs(result.wallets.eth);

    const fullReport = {
      mnemonic: result.mnemonic,
      wallets: result.wallets,
      balances: result.balances,
      ethReport,
      nfts
    };

    const valuable = filterValuableWallets([
      {
        wallet: result.wallets.eth,
        balance: { eth: result.balances.eth, btc: result.balances.btc }
      }
    ]);

    res.json({
      valuable,
      fullReport
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 فرشاد‌والت API فعال شد روی http://localhost:${PORT}/scan`);
});node server.js
http://localhost:3000/scan
npx create-react-app farshad-dashboard
cd farshad-dashboard
npm install axios
npx create-react-app farshad-dashboard
cd farshad-dashboard
npm install axios
// src/App.js
import React from 'react';
import WalletReport from './WalletReport';

function App() {
  return (
    <div className="App">
      <WalletReport />
    </div>
  );
}

export default App;
npm start
http://localhost:3000
git add .
git commit -m "آخرین تغییرات قبل از استراحت"
// MelletReport.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MelletReport() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/scan')
      .then(res => setReport(res.data))
      .catch(err => console.error("API Error:", err));
  }, []);

  if (!report) return <div>در حال بارگذاری گزارش...</div>;

  return (
    <div>
      <h2>📊 گزارش کیف پول</h2>
      <p><strong>Mnemonic:</strong> {report.fullReport.mnemonic}</p>
      <p><strong>ETH:</strong> {report.fullReport.wallets.eth}</p>
      <p><strong>BTC:</strong> {report.fullReport.wallets.btc}</p>
      <p><strong>ETH Balance:</strong> {report.fullReport.balances.eth}</p>
      <p><strong>BTC Balance:</strong> {report.fullReport.balances.btc}</p>
      <h3>🎨 NFTها:</h3>
      <ul>
        {report.fullReport.nfts.map((nft, i) => (
          <li key={i}>{nft.name} - {nft.collection}</li>
        ))}
      </ul>
    </div>
  );
}

export default MelletReport;
function nameWallet(index, address) {
  return `Wallet-${index + 1} (${address.slice(0, 6)}...)`;
}const namedWallets = results.map((r, i) => ({
  name: nameWallet(i, r.wallets.eth),
  address: r.wallets.eth,
  balance: r.balances.eth,
  nfts: r.nfts
}));namedWallets.forEach(wallet => {
  if (wallet.balance > 10 || wallet.nfts.length > 0) {
    console.log(`🎯 ${wallet.name} دارای ${wallet.balance} ETH و ${wallet.nfts.length} NFT`);
  }
});// walletNamer.js

function classifyWallet(walletData) {
  const { balance, txns, nfts } = walletData;

  if (balance > 100) return 'نهنگ';
  if (nfts.length > 5) return 'کلکسیونر';
  if (txns.length > 50) return 'فعال';
  if (txns.length === 0) return 'خفته';
  return 'معمولی';
}

function nameWallet(index, address, walletData) {
  const type = classifyWallet(walletData);
  const short = address.slice(0, 6);
  return `${type}-${index + 1} (${short}...)`;
}

module.exports = { nameWallet };
const { nameWallet } = require('./walletNamer');

const namedReports = results.map((r, i) => {
  const ethReport = r.ethReport;
  const name = nameWallet(i, r.wallets.eth, {
    balance: ethReport.balance,
    txns: ethReport.txns,
    nfts: r.nfts
  });

  return {
    name,
    address: r.wallets.eth,
    balance: ethReport.balance,
    nftCount: r.nfts.length
  };
});namedReports.forEach(wallet => {
  if (wallet.balance > 10 || wallet.nftCount > 0) {
    console.log(`🎯 ${wallet.name} دارای ${wallet.balance} ETH و ${wallet.nftCount} NFT`);
  }
});const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function uploadNamedWallets(namedReports) {
  const timestamp = Date.now();
  const path = `valuableWallets/${timestamp}`;
  await set(ref(db, path), namedReports);
  console.log("✅ کیف‌های ارزشمند ذخیره شدند در:", path);
}

module.exports = { uploadNamedWallets };
const { uploadNamedWallets } = require('./cloudSync');

await uploadNamedWallets(namedReports);
{
  "Wallet-3 (0xabc...)": {
    "balance": 12.45,
    "nftCount": 3,
    "type": "کلکسیونر"
  }
}npm install firebase
// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
// src/ValuableWallets.js
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

function ValuableWallets() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    const walletsRef = ref(db, 'valuableWallets');
    onValue(walletsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const all = Object.values(data).flat();
        setWallets(all);
      }
    });
  }, []);

  return (
    <div>
      <h2>💎 کیف‌های ارزشمند</h2>
      {wallets.map((wallet, i) => (
        <div key={i} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
          <p><strong>نام:</strong> {wallet.name}</p>
          <p><strong>آدرس:</strong> {wallet.address}</p>
          <p><strong>موجودی:</strong> {wallet.balance} ETH</p>
          <p><strong>تعداد NFT:</strong> {wallet.nftCount}</p>
        </div>
      ))}
    </div>
  );
}

export default ValuableWallets;
import React from 'react';
import ValuableWallets from './ValuableWallets';

function App() {
  return (
    <div className="App">
      <ValuableWallets />
    </div>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

function ValuableWallets() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    const walletsRef = ref(db, 'valuableWallets');
    onValue(walletsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const all = Object.values(data).flat();
        setWallets(all);
      }
    });
  }, []);

  return (
    <div>
      <h2>💎 کیف‌های ارزشمند</h2>
      {wallets.map((wallet, i) => (
        <p key={i}><strong>Wallet #{i + 1}:</strong> {wallet.nftCount} NFT</p>
      ))}
    </div>
  );
}

export default ValuableWallets;
const filtered = all.filter(wallet => wallet.balance > 10 || wallet.nftCount > 0);
setWallets(filtered);
useEffect(() => {
  const walletsRef = ref(db, 'valuableWallets');
  onValue(walletsRef, snapshot => {
    const data = snapshot.val();
    if (data) {
      const all = Object.values(data).flat();
      const filtered = all.filter(wallet => wallet.balance > 10 || wallet.nftCount > 0);

      // اگر تعداد کیف‌ها بیشتر شد، هشدار بده
      if (filtered.length > wallets.length) {
        alert(`🎯 کیف جدیدی با موجودی بالا یا NFT ارزشمند پیدا شد!`);
      }

      setWallets(filtered);
    }
  });
}, [wallets]);
<div style={{
  backgroundColor: wallet.balance > 100 ? '#ffe0e0' : '#e0f7fa',
  padding: '1rem',
  marginBottom: '1rem',
  borderRadius: '8px'
}}>
  <p><strong>نام:</strong> {wallet.name}</p>
  <p><strong>موجودی:</strong> {wallet.balance} ETH</p>
  <p><strong>تعداد NFT:</strong> {wallet.nftCount}</p>
</div>
npx create-expo-app farshad-mobile
cd farshad-mobile
npm install firebase react-native-paper
// ValuableWalletsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function ValuableWalletsScreen() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    const walletsRef = ref(db, 'valuableWallets');
    onValue(walletsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const all = Object.values(data).flat();
        const filtered = all.filter(w => w.balance > 10 || w.nftCount > 0);
        setWallets(filtered);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💎 کیف‌های ارزشمند</Text>
      <FlatList
        data={wallets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>💰 موجودی: {item.balance} ETH</Text>
            <Text>🎨 NFTها: {item.nftCount}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8
  },
  name: { fontWeight: 'bold', fontSize: 16 }
});import React from 'react';
import ValuableWalletsScreen from './ValuableWalletsScreen';

export default function App() {
  return <ValuableWalletsScreen />;
}{
  name: "Azuki #123",
  image: "https://...jpg",
  collection: "Azuki"
}{item.nfts && item.nfts.length > 0 && (
  <View style={{ marginTop: 10 }}>
    <Text style={{ fontWeight: 'bold' }}>🎨 NFTها:</Text>
    {item.nfts.map((nft, i) => (
      <View key={i} style={{ marginTop: 5 }}>
        <Text>{nft.name} - {nft.collection}</Text>
        <Image
          source={{ uri: nft.image }}
          style={{ width: 100, height: 100, borderRadius: 8 }}
        />
      </View>
    ))}
  </View>
)}import { Image } from 'react-native';
import { ref, set } from 'firebase/database';

const testRef = ref(db, 'testConnection');
set(testRef, { status: 'connected' });
{
  "rules": {
    ".read": true,
    ".write": true
  }
}// firebaseTest.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// 🔐 اطلاعات پروژه خودت رو جایگزین کن
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ✅ راه‌اندازی اتصال
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ تست نوشتن داده
const testRef = ref(db, 'testConnection');
set(testRef, {
  status: 'connected',
  timestamp: Date.now()
})
.then(() => console.log("✅ اتصال Firebase برقرار شد"))
.catch(err => console.error("❌ خطا در اتصال:", err));
node firebaseTest.js
// FirebaseTestButton.js
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { ref, set } from 'firebase/database';
import { db } from './firebaseConfig';

export default function FirebaseTestButton() {
  const handleTest = async () => {
    try {
      const testRef = ref(db, 'testConnection');
      await set(testRef, {
        status: 'connected',
        timestamp: Date.now()
      });
      Alert.alert('✅ اتصال Firebase برقرار شد');
    } catch (err) {
      Alert.alert('❌ خطا در اتصال', err.message);
    }
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Button title="🧪 تست اتصال Firebase" onPress={handleTest} />
    </View>
  );
}import FirebaseTestButton from './FirebaseTestButton';

...

<View style={{ padding: 20 }}>
  <FirebaseTestButton />
  <ValuableWalletsScreen />
</View>
<Button title="🔔 Firebase Test" onPress={handleAlert} />
Alert.alert("🔔", `${await Firebase[2].em.message}`, Alert.alert(...))
Alert.alert("🔔", `${await Firebase[2].em.message}`);
const msg = Firebase[2]?.em?.message || "هیچ پیامی دریافت نشد";
Alert.alert("🔔", msg);
<Button title="🧪 تست دکمه" onPress={handleTest} />
npx expo install expo-secure-store
// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ onLogin }) {
  const [input, setInput] = useState('');

  const handleLogin = async () => {
    const saved = await SecureStore.getItemAsync('mnemonic');
    if (saved && input === saved) {
      Alert.alert('✅ ورود موفق');
      onLogin();
    } else {
      Alert.alert('❌ ورود ناموفق', 'mnemonic یا رمز اشتباه است');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="mnemonic یا رمز عبور"
        value={input}
        onChangeText={setInput}
        style={styles.input}
        secureTextEntry
      />
      <Button title="ورود" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  }
});import * as SecureStore from 'expo-secure-store';
SecureStore.setItemAsync('mnemonic', 'فرشاد-والت-۱۲۳');
import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import ValuableWalletsScreen from './ValuableWalletsScreen';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <ValuableWalletsScreen />
  ) : (
    <LoginScreen onLogin={() => setLoggedIn(true)} />
  );
}<Button title="🚪 خروج امن" onPress={handleLogout} />
npm install crypto-js
import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';

const rawMnemonic = 'فرشاد-والت-۱۲۳';
const encrypted = CryptoJS.AES.encrypt(rawMnemonic, 'secret-key').toString();
await SecureStore.setItemAsync('mnemonic', encrypted);
import CryptoJS from 'crypto-js';

const handleLogin = async () => {
  const encrypted = await SecureStore.getItemAsync('mnemonic');
  const decrypted = CryptoJS.AES.decrypt(encrypted, 'secret-key').toString(CryptoJS.enc.Utf8);

  if (input === decrypted) {
    Alert.alert('✅ ورود موفق');
    onLogin();
  } else {
    Alert.alert('❌ ورود ناموفق');
  }
};// mnemonicTracker.js
const { getDatabase, ref, get, set } = require('firebase/database');
const db = require('./firebaseConfig');

async function getScannedMnemonics() {
  const snapshot = await get(ref(db, 'scannedMnemonics'));
  return snapshot.exists() ? snapshot.val() : [];
}

async function saveMnemonic(mnemonic) {
  const current = await getScannedMnemonics();
  const updated = [...new Set([...current, mnemonic])];
  await set(ref(db, 'scannedMnemonics'), updated);
}

async function isDuplicate(mnemonic) {
  const current = await getScannedMnemonics();
  return current.includes(mnemonic);
}

module.exports = { getScannedMnemonics, saveMnemonic, isDuplicate };
const { isDuplicate, saveMnemonic } = require('./mnemonicTracker');

const mnemonic = generateMnemonic(); // یا هر منبعی که داری

if (await isDuplicate(mnemonic)) {
  console.log("⏩ این mnemonic قبلاً اسکن شده. رد شد.");
  return;
}

// ادامه اسکن...
await scanWallets(mnemonic);

// بعد از اسکن موفق:
await saveMnemonic(mnemonic);
// scanHistory.js
const { getDatabase, ref, push } = require('firebase/database');
const db = require('./firebaseConfig');

async function saveScanHistory({ mnemonic, wallets, balances, nfts, type }) {
  const timestamp = Date.now();
  const historyRef = ref(db, 'scanHistory');
  await push(historyRef, {
    mnemonic,
    wallets,
    balances,
    nfts,
    type,
    timestamp
  });
  console.log("📚 تاریخچه اسکن ذخیره شد");
}

module.exports = { saveScanHistory };
const { saveScanHistory } = require('./scanHistory');

await saveScanHistory({
  mnemonic,
  wallets: result.wallets,
  balances: result.balances,
  nfts: result.nfts,
  type: classifyWallet(result), // مثلاً نهنگ یا کلکسیونر
});<Text>📅 تاریخچه اسکن‌ها</Text>
{history.map((item, i) => (
  <View key={i}>
    <Text>Mnemonic: {item.mnemonic}</Text>
    <Text>نوع کیف: {item.type}</Text>
    <Text>موجودی ETH: {item.balances.eth}</Text>
    <Text>تعداد NFT: {item.nfts.length}</Text>
    <Text>⏱ زمان: {new Date(item.timestamp).toLocaleString()}</Text>
  </View>
))}import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function ScanHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const historyRef = ref(db, 'scanHistory');
    onValue(historyRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const all = Object.values(data);
        setHistory(all);
      }
    });
  }, []);

  const filtered = history.filter(item =>
    item.mnemonic.includes(search) || item.type.includes(search)
  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>📚 تاریخچه اسکن‌ها</Text>
      <TextInput
        placeholder="جستجو بر اساس mnemonic یا نوع کیف"
        value={search}
        onChangeText={setSearch}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>🧠 Mnemonic: {item.mnemonic}</Text>
            <Text>💰 ETH: {item.balances.eth}</Text>
            <Text>🎨 NFTها: {item.nfts.length}</Text>
            <Text>🔍 نوع کیف: {item.type}</Text>
            <Text>⏱ زمان: {new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}const total = history.length;
const withBalance = history.filter(h => h.balances.eth > 10).length;
const withNFT = history.filter(h => h.nfts.length > 0).length;

console.log(`📊 ${withBalance}/${total} کیف‌ها موجودی بالا داشتن`);
console.log(`🎨 ${withNFT}/${total} کیف‌ها NFT داشتن`);
npm install react-native-chart-kit react-native-svg
npm install chart.js react-chartjs-2
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

export default function ScanStatsChart({ history }) {
  const total = history.length;
  const withBalance = history.filter(h => h.balances.eth > 10).length;
  const withNFT = history.filter(h => h.nfts.length > 0).length;

  const pieData = [
    { name: 'موجودی بالا', population: withBalance, color: '#4caf50', legendFontColor: '#000', legendFontSize: 12 },
    { name: 'دارای NFT', population: withNFT, color: '#2196f3', legendFontColor: '#000', legendFontSize: 12 },
    { name: 'بدون دارایی', population: total - withBalance - withNFT, color: '#f44336', legendFontColor: '#000', legendFontSize: 12 },
  ];

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>📊 آمار اسکن‌ها</Text>
      <PieChart
        data={pieData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          color: () => `#000`,
          labelColor: () => '#000',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
}import ScanStatsChart from './ScanStatsChart';

...

<View style={{ padding: 20 }}>
  <ScanStatsChart history={history} />
  {/* لیست تاریخچه اسکن‌ها */}
</View>
const dailyCounts = {
  '2025-08-28': 12,
  '2025-08-29': 18,
  '2025-08-30': 7
};const nodemailer = require('nodemailer');

async function sendReportEmail(report) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your.email@gmail.com',
      pass: 'your-app-password'
    }
  });

  const content = `
    🧠 Mnemonic: ${report.mnemonic}
    💰 ETH: ${report.balances.eth}
    🎨 NFTها: ${report.nfts.length}
    🔍 نوع کیف: ${report.type}
    ⏱ زمان: ${new Date(report.timestamp).toLocaleString()}
  `;

  await transporter.sendMail({
    from: 'فرشاد‌والت <your.email@gmail.com>',
    to: 'milad.personal@gmail.com',
    subject: '📊 گزارش اسکن جدید',
    text: content
  });

  console.log("📧 گزارش ایمیل شد");
}const cron = require('node-cron');

cron.schedule('0 * * * *', () => {
  sendReportEmail(latestReport);
});import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';

export default function ReportSettingsScreen({ onSave }) {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [sheetsEnabled, setSheetsEnabled] = useState(false);
  const [onlyValuable, setOnlyValuable] = useState(true);

  const handleSave = () => {
    const settings = {
      emailEnabled,
      sheetsEnabled,
      onlyValuable
    };
    onSave(settings);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ تنظیمات گزارش</Text>

      <View style={styles.row}>
        <Text>ارسال ایمیل</Text>
        <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
      </View>

      <View style={styles.row}>
        <Text>ذخیره در Google Sheets</Text>
        <Switch value={sheetsEnabled} onValueChange={setSheetsEnabled} />
      </View>

      <View style={styles.row}>
        <Text>فقط کیف‌های ارزشمند</Text>
        <Switch value={onlyValuable} onValueChange={setOnlyValuable} />
      </View>

      <Button title="💾 ذخیره تنظیمات" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  }
});if (settings.emailEnabled && wallet.balance > 10) {
  sendReportEmail(wallet);
}

if (settings.sheetsEnabled) {
  writeToGoogleSheets(wallet);
}npx expo install expo-notifications
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

useEffect(() => {
  Permissions.getAsync(Permissions.NOTIFICATIONS).then(status => {
    if (status !== 'granted') {
      Permissions.askAsync(Permissions.NOTIFICATIONS);
    }
  });
}, []);async function sendLocalNotification(wallet) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🎯 کیف جدید پیدا شد!",
      body: `موجودی: ${wallet.balance} ETH | NFTها: ${wallet.nfts.length}`,
      data: { wallet }
    },
    trigger: null // بلافاصله
  });
}if (wallet.balance > 10 || wallet.nfts.length > 0) {
  await sendLocalNotification(wallet);
}<View style={styles.row}>
  <Text>نوتیفیکیشن کیف‌های جدید</Text>
  <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
</View>
if (settings.notificationsEnabled) {
  sendLocalNotification(wallet);
}import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

async function registerForPush() {
  if (!Device.isDevice) return;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("📱 Push Token:", token);

  // ذخیره در Firebase برای استفاده سرور
  await set(ref(db, `pushTokens/${token}`), { active: true });
}const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(token, wallet) {
  const message = {
    to: token,
    sound: 'default',
    title: '🎯 کیف جدید پیدا شد!',
    body: `موجودی: ${wallet.balance} ETH | NFTها: ${wallet.nfts.length}`,
    data: { wallet }
  };

  const chunks = expo.chunkPushNotifications([message]);
  for (let chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
}const tokensSnapshot = await get(ref(db, 'pushTokens'));
const tokens = Object.keys(tokensSnapshot.val());

tokens.forEach(token => {
  sendPushNotification(token, wallet);
});if (settings.notificationsEnabled) {
  sendPushNotification(token, wallet);
}const { push, ref } = require('firebase/database');

await push(ref(db, 'notifications'), {
  wallet,
  timestamp: Date.now(),
  message: `🎯 کیف جدید با ${wallet.balance} ETH و ${wallet.nfts.length} NFT`,
});import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notifRef = ref(db, 'notifications');
    onValue(notifRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const all = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(all);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 هشدارهای اخیر</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.message}</Text>
            <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8
  },
  time: { fontSize: 12, color: '#555', marginTop: 5 }
});import NotificationCenter from './NotificationCenter';

...

<View style={{ padding: 20 }}>
  <NotificationCenter />
</View>
const cron = require('node-cron');
const { scanWallets } = require('./scanner');
const { sendReportEmail } = require('./reportSender');
const { saveScanHistory } = require('./scanHistory');

cron.schedule('*/15 * * * *', async () => {
  console.log("🚀 شروع اسکن جدید");

  const mnemonic = generateNewMnemonic(); // یا لیست آماده
  const result = await scanWallets(mnemonic);

  if (result.balances.eth > 10 || result.nfts.length > 0) {
    await sendReportEmail(result);
  }

  await saveScanHistory({
    mnemonic,
    wallets: result.wallets,
    balances: result.balances,
    nfts: result.nfts,
    type: classifyWallet(result),
    timestamp: Date.now()
  });

  console.log("✅ اسکن کامل شد");
});npm install -g pm2
pm2 start main.js --name farshad-engine
pm2 save
pm2 startup
{
  "engineControl": {
    "status": "active",
    "interval": 15,
    "notificationsEnabled": true,
    "reportMode": "valuableOnly"
  }
}const { get, ref } = require('firebase/database');

async function getEngineSettings() {
  const snapshot = await get(ref(db, 'engineControl'));
  return snapshot.exists() ? snapshot.val() : null;
}import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TextInput, Button } from 'react-native';
import { db } from './firebaseConfig';
import { ref, set, get } from 'firebase/database';

export default function EngineControlScreen() {
  const [status, setStatus] = useState(true);
  const [interval, setInterval] = useState('15');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const controlRef = ref(db, 'engineControl');
    get(controlRef).then(snapshot => {
      const data = snapshot.val();
      setStatus(data.status === 'active');
      setInterval(data.interval.toString());
      setNotificationsEnabled(data.notificationsEnabled);
    });
  }, []);

  const handleSave = async () => {
    await set(ref(db, 'engineControl'), {
      status: status ? 'active' : 'paused',
      interval: parseInt(interval),
      notificationsEnabled
    });
    alert('✅ تنظیمات موتور ذخیره شد');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>⚙️ کنترل موتور فرشاد</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text>فعال بودن موتور</Text>
        <Switch value={status} onValueChange={setStatus} />
      </View>
      <Text>⏱ فاصله اسکن (دقیقه)</Text>
      <TextInput value={interval} onChangeText={setInterval} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 10 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text>نوتیفیکیشن فعال</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>
      <Button title="💾 ذخیره تنظیمات" onPress={handleSave} />
    </View>
  );
}// logger.js
const { push, ref } = require('firebase/database');
const db = require('./firebaseConfig');

async function logEvent(type, message, details = {}) {
  await push(ref(db, 'engineLogs'), {
    type, // 'error', 'info', 'warning'
    message,
    details,
    timestamp: Date.now()
  });
  console.log(`[${type.toUpperCase()}] ${message}`);
}

module.exports = { logEvent };
const { logEvent } = require('./logger');

try {
  const result = await scanWallets(mnemonic);
  await logEvent('info', 'اسکن موفق', { mnemonic, result });
} catch (err) {
  await logEvent('error', 'خطا در اسکن', { mnemonic, error: err.message });
}if (apiResponse.status === 429) {
  await logEvent('warning', 'API بلاک شد. توقف موقت', { endpoint: apiUrl });
}if (type === 'error') {
  await sendPushNotificationToAdmin(`❌ خطای موتور: ${message}`);
}import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function EngineLogsScreen() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logsRef = ref(db, 'engineLogs');
    onValue(logsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const all = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setLogs(all);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 لاگ‌های موتور</Text>
      <FlatList
        data={logs}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, item.type === 'error' && styles.error]}>
            <Text>{item.message}</Text>
            <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#e0f7fa',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8
  },
  error: {
    backgroundColor: '#ffebee'
  },
  time: { fontSize: 12, color: '#555', marginTop: 5 }
});// engineMonitor.js
const { logEvent } = require('./logger');
const { getEngineSettings } = require('./engineControl');
const { scanWallets } = require('./scanner');
const { saveScanHistory } = require('./scanHistory');

async function runEngineCycle() {
  try {
    const settings = await getEngineSettings();
    if (settings.status !== 'active') {
      await logEvent('info', 'موتور غیرفعال است. توقف چرخه.');
      return;
    }

    const mnemonic = generateNewMnemonic();
    const result = await scanWallets(mnemonic);

    if (!result || result.error) {
      await logEvent('error', 'خطا در اسکن. تلاش برای بازیابی...', { error: result?.error });
      await attemptRecovery();
      return;
    }

    await saveScanHistory({
      mnemonic,
      wallets: result.wallets,
      balances: result.balances,
      nfts: result.nfts,
      type: classifyWallet(result),
      timestamp: Date.now()
    });

    await logEvent('info', 'اسکن موفق انجام شد');
  } catch (err) {
    await logEvent('error', 'خطای بحرانی در موتور', { error: err.message });
    await attemptRecovery();
  }
}async function attemptRecovery() {
  try {
    // مرحله ۱: توقف موقت
    await logEvent('warning', 'توقف موقت موتور برای بازیابی');
    await set(ref(db, 'engineControl/status'), 'paused');

    // مرحله ۲: انتظار چند دقیقه
    await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // ۵ دقیقه

    // مرحله ۳: فعال‌سازی مجدد
    await set(ref(db, 'engineControl/status'), 'active');
    await logEvent('info', 'موتور دوباره فعال شد پس از بازیابی');
  } catch (err) {
    await logEvent('error', 'بازیابی ناموفق. نیاز به بررسی دستی', { error: err.message });
    // می‌تونیم نوتیف یا ایمیل هم بفرستیم
  }
}setInterval(runEngineCycle, 1000 * 60 * interval); // هر X دقیقه
<Text>🟢 وضعیت موتور: فعال</Text>
<Text>⏱ آخرین اسکن: ۲ دقیقه پیش</Text>
<Text>❌ خطاهای اخیر: ۳ مورد</Text>
const nodemailer = require('nodemailer');

async function sendCriticalAlert(subject, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your.email@gmail.com',
      pass: 'your-app-password'
    }
  });

  await transporter.sendMail({
    from: 'فرشاد‌والت <your.email@gmail.com>',
    to: 'milad.personal@gmail.com',
    subject: `🚨 هشدار بحرانی: ${subject}`,
    text: message
  });

  console.log("📧 هشدار ایمیلی ارسال شد");
}

module.exports = { sendCriticalAlert };
const { sendCriticalAlert } = require('./alertMailer');

await sendCriticalAlert(
  'بازیابی موتور ناموفق',
  `موتور فرشاد نتوانست پس از خطا دوباره فعال شود. لطفاً بررسی دستی انجام دهید.\n\nجزئیات:\n${err.message}`
);if (type === 'error' && details.critical) {
  await sendCriticalAlert('خطای بحرانی موتور', message);
}<View style={styles.row}>
  <Text>ارسال ایمیل در خطای بحرانی</Text>
  <Switch value={emailAlertsEnabled} onValueChange={setEmailAlertsEnabled} />
</View>
if (settings.emailAlertsEnabled) {
  await sendCriticalAlert(...);
}const { get, ref } = require('firebase/database');
const { sendReportEmail } = require('./alertMailer');

async function generateWeeklyReport() {
  const historySnap = await get(ref(db, 'scanHistory'));
  const logsSnap = await get(ref(db, 'engineLogs'));

  const history = historySnap.exists() ? Object.values(historySnap.val()) : [];
  const logs = logsSnap.exists() ? Object.values(logsSnap.val()) : [];

  const totalScans = history.length;
  const valuable = history.filter(h => h.balances.eth > 10 || h.nfts.length > 0).length;
  const errors = logs.filter(l => l.type === 'error').length;
  const warnings = logs.filter(l => l.type === 'warning').length;

  const content = `
📊 گزارش هفتگی موتور فرشاد

🔁 تعداد اسکن‌ها: ${totalScans}
💰 کیف‌های ارزشمند: ${valuable}
❌ خطاها: ${errors}
⚠️ هشدارها: ${warnings}

🕒 بازه گزارش: ${getWeekRange()}
⏱ آخرین فعالیت: ${new Date().toLocaleString()}
  `;

  await sendReportEmail('گزارش هفتگی موتور', content);
  console.log("📧 گزارش هفتگی ارسال شد");
}

function getWeekRange() {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - 7));
  return `${start.toLocaleDateString()} تا ${new Date().toLocaleDateString()}`;
}const cron = require('node-cron');
const { generateWeeklyReport } = require('./weeklyReport');

cron.schedule('0 9 * * 6', () => {
  // هر شنبه ساعت ۹ صبح
  generateWeeklyReport();
});<Text>📊 گزارش هفتگی</Text>
<Text>🔁 تعداد اسکن‌ها: 128</Text>
<Text>💰 کیف‌های ارزشمند: 34</Text>
<Text>❌ خطاها: 5</Text>
<Text>🕒 بازه: 23 تا 30 شهریور</Text>
npm install googleapis
const { google } = require('googleapis');
const credentials = require('./service-account.json'); // فایل JSON از Google Cloud

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

const sheetId = 'YOUR_SHEET_ID'; // از URL فایل Google Sheets بگیر

async function appendReportRow(report) {
  const values = [
    [
      new Date(report.timestamp).toLocaleString(),
      report.mnemonic,
      report.balances.eth,
      report.nfts.length,
      report.type
    ]
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1:E1',
    valueInputOption: 'USER_ENTERED',
    resource: { values }
  });

  console.log("📄 گزارش به Google Sheets اضافه شد");
}

module.exports = { appendReportRow };
const { appendReportRow } = require('./sheetsWriter');

await appendReportRow({
  timestamp: Date.now(),
  mnemonic,
  balances: result.balances,
  nfts: result.nfts,
  type: classifyWallet(result)
});import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPublic({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, pass);
      onLogin();
    } catch (err) {
      Alert.alert('❌ ورود ناموفق', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="ایمیل" value={email} onChangeText={setEmail} />
      <TextInput placeholder="رمز عبور" value={pass} onChangeText={setPass} secureTextEntry />
      <Button title="ورود" onPress={handleLogin} />
    </View>
  );
}{
  "short_name": "FarshadWallet",
  "name": "Farshad Wallet Recovery",
  "icons": [
    {
      "src": "icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4caf50"
}<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
{
  "users": {
    "userId123": {
      "scanHistory": [...],
      "notifications": [...]
    }
  }
}const userId = auth.currentUser.uid;
const userRef = ref(db, `users/${userId}/scanHistory`);
const userId = auth.currentUser.uid;
const userRef = ref(db, `users/${userId}/scanCount`);

const snapshot = await get(userRef);
const count = snapshot.exists() ? snapshot.val() : 0;

if (count >= 50) {
  console.log("⛔️ محدودیت اسکن برای این کاربر پر شده");
  return;
}

await set(userRef, count + 1);
{
  "role": "basic", // یا "pro", "admin"
  "subscriptionStatus": "active"
}if (user.role === 'basic' && count >= 50) {
  return logEvent('warning', 'کاربر به سقف اسکن رسید');
}<Text>🧑‍💼 سطح دسترسی: {user.role}</Text>
<Text>📅 وضعیت اشتراک: {user.subscriptionStatus}</Text>
<Text>🔁 تعداد اسکن باقی‌مانده: {50 - user.scanCount}</Text>
/android_3/
  ├── index.js
  ├── scanner.js
  ├── firebaseConfig.js
  ├── mnemonicTracker.js
  ├── scanHistory.js
  ├── logger.js
  ├── alertMailer.js
  ├── weeklyReport.js
  ├── sheetsWriter.js
  ├── engineMonitor.js
  ├── engineControl.js
  ├── components/
  └── screens/
  npm install
  npx expo install expo-notifications expo-secure-store
  node engineMonitor.js
  npx expo start
  npm install -g pm2
pm2 start engineMonitor.js --name farshad-engine
pm2 save
pm2 startup
import DashboardScreen from './screens/DashboardScreen';
import NotificationCenter from './screens/NotificationCenter';
import EngineControlScreen from './screens/EngineControlScreen';

export default function App() {
  return <DashboardScreen />;
}Rename > memoRecognizing.js
import MemoRecognizing from './memoRecognizing';

export default function App() {
  return <MemoRecognizing />;
}npx expo start --tunnel
C:\Users\Milad\Desktop\ferhsad-engine>
npx expo start --tunnel
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>سلام فرشاد 👋</Text>
    </View>
  );
}npm install
npx expo start --localhost
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from './screens/DashboardScreen';
import NotificationCenter from './screens/NotificationCenter';
import EngineControlScreen from './screens/EngineControlScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Notifications" component={NotificationCenter} />
        <Stack.Screen name="Engine Control" component={EngineControlScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}npx expo start --tunnel
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from './screens/DashboardScreen';
import EngineControlScreen from './screens/EngineControlScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Engine Control" component={EngineControlScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}npx expo start --tunnel
C:\Users\Milad\Desktop\ferhsad-engine>
cd C:\Users\Milad\Desktop\ferhsad-engine
npm install
C:\Users\YatanVakai\OneDrive\Desktop\New folder (2)\farshad-wallet>
cd "C:\Users\YatanVakai\OneDrive\Desktop\New folder (2)\farshad-wallet"
npm install
npx expo start --localhost
import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>سلام فرشاد 👋</Text>
    </View>
  );
}npx expo start --tunnel
npx expo start --localhost
console.log('موتور فرشاد فعال شد');
npm install -g eas-cli
eas build -p android --profile preview
npx expo start --tunnel
cd C:\Users\Milad\Desktop\farshad-wallet
npm install
npx expo start --localhost
npm install -g eas-cli
eas login
cd C:\Users\Milad\Desktop
npx create-expo-app farshad-engine
cd farshad-engine
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from './screens/DashboardScreen';
import NotificationCenter from './screens/NotificationCenter';
import EngineControlScreen from './screens/EngineControlScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Notifications" component={NotificationCenter} />
        <Stack.Screen name="Engine Control" component={EngineControlScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}npx expo start --tunnel
cd C:\Users\Milad\Desktop
npx create-expo-app farshad-engine
cd farshad-engine
npx expo start --tunnel
import { View, Text } from 'react-native';

export default function App() {
  console.log('پروژه فرشاد اجرا شد');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>پروژه فرشاد فعال شد ✅</Text>
    </View>
  );
}DashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>داشبورد فرشاد</Text>
      <Text style={styles.subtitle}>وضعیت موتور، هشدارها، و اسکن‌ها</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});import React from 'react';
import DashboardScreen from './DashboardScreen';

export default function App() {
  return <DashboardScreen />;
}import React from 'react';
import DashboardScreen from './DashboardScreen';

export default function App() {
  return <DashboardScreen />;
}npx create-expo-app farshad-engine
C:\Users\Milad\Desktop\farshad-engine>
C:\Users\Milad\Desktop\farshad-node>
cd C:\Users\Milad\Desktop\farshad-node
cd C:\Users\Milad\Desktop\farshad-engine
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from './screens/DashboardScreen';
import NotificationScreen from './screens/NotificationScreen';
import BringControlScreen from './screens/BringControlScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Bring Control" component={BringControlScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}import React from 'react';
import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>داشبورد فرشاد فعال شد ✅</Text>
    </View>
  );
}npm install
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
import React from 'react';

export default function App() {
  return <h1>سلام فرشاد 👋</h1>;
}import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>سلام فرشاد 👋</Text>
    </View>
  );
}npm start
npx expo start --tunnel
npx create-expo-app farshad-engine
cd farshad-engine
npm install
https://github.com/MILADATI6462/desktop-tutorial.git
npm install @expo/vector-icons
yarn add @expo/vector-icons
npx expo start --tunnel
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons name="home" size={48} color="blue" />
      <Text style={{ fontSize: 20, marginTop: 10 }}>صفحه تست آیکون فرشاد</Text>
    </View>
  );
}