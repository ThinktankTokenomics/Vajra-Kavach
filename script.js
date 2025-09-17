// Web3 Global Variables
let provider;
let signer;
let contract;
let currentAccount;
let contractOwnerAddress; 
let networkId; 

//  CONTRACT DETAILS 

const CONTRACT_ADDRESS = "0xDB2C00EB93F1CA19a761Ea8946826d5452D6a6A4"; 
// contract ABI 
const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "claimPayout",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "claimedAmount",
                "type": "uint256"
            }
        ],
        "name": "PayoutClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "payoutAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "eventType",
                "type": "string"
            }
        ],
        "name": "PayoutTriggered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "premium",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "insuranceAmount",
                "type": "uint256"
            }
        ],
        "name": "PolicySubscribed",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_farmerAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_eventType",
                "type": "string"
            }
        ],
        "name": "simulateWeatherEvent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_cropType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_landAreaSqMeters",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_planType",
                "type": "uint256"
            }
        ],
        "name": "subscribePolicy",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "eventType",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "WeatherEventSimulated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_farmer",
                "type": "address"
            }
        ],
        "name": "getPolicyDetails",
        "outputs": [
            {
                "internalType": "address",
                "name": "farmerAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "cropType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "landAreaSqMeters",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "premiumPaid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "insuranceAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum KrishiSuraksha.PolicyStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "policyStartTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "payoutTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasPolicy",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastWeatherEventTimestamp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastWeatherEventType",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "policies",
        "outputs": [
            {
                "internalType": "address",
                "name": "farmerAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "cropType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "landAreaSqMeters",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "premiumPaid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "insuranceAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum KrishiSuraksha.PolicyStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "policyStartTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "payoutTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "policyCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]



function showMessage(message, type = 'info') {
    const msgBox = document.getElementById('messageBox');
    msgBox.textContent = message;
    msgBox.className = `message-box ${type}`;
    msgBox.style.display = 'block';
    setTimeout(() => {
        msgBox.style.display = 'none';
    }, 5000); 
}


function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}


async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        showMessage("MetaMask is not installed. Please install MetaMask to use this DApp.", "error");
        return;
    }

    try {
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];

        
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        
        const network = await provider.getNetwork();
        networkId = network.chainId;

        
        if (!ethers.utils.isAddress(CONTRACT_ADDRESS)) {
            showMessage("ERROR: The contract address configured in JavaScript is invalid. Please ensure it's a valid Ethereum address.", "error");
            console.error("CONTRACT_ADDRESS is invalid.");
            return;
        }
        
        
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        
        try {
            contractOwnerAddress = await contract.owner();
        } catch (ownerError) {
            console.error("Error fetching contract owner (might be ABI mismatch or contract not deployed at this address):", ownerError);
            showMessage(`Could not verify contract owner. Please ensure contract is deployed correctly on Sepolia at ${CONTRACT_ADDRESS} and ABI matches. Error: ${ownerError.message || ownerError}`, "error");

            
        }
        
       showMessage(`Wallet connected: ${formatAddress(currentAccount)}`, "success");

        updateUI(); 

        
        window.ethereum.on('accountsChanged', (newAccounts) => {
            if (newAccounts.length > 0) {
                currentAccount = newAccounts[0];
                signer = provider.getSigner();
                updateUI();
                showMessage(`Account changed to: ${formatAddress(currentAccount)}`, "info");
            } else {
                disconnectWallet();
                showMessage("Wallet disconnected.", "info");
            }
        });

        
        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload(); 
        });

    } catch (error) {
        console.error("Error connecting wallet (main catch block):", error);
        showMessage(`Failed to connect wallet: ${error.message || error}`, "error");

    }
}

function disconnectWallet() {
    currentAccount = null;
    provider = null;
    signer = null;
    contract = null;
    contractOwnerAddress = null; 
    updateUI();
    showMessage("Wallet disconnected.", "info");
}

async function updateUI() {
    const connectBtn = document.getElementById('connectWalletBtn');
    const disconnectBtn = document.getElementById('disconnectWalletBtn');
    const currentAccountDisplay = document.getElementById('currentAccount');
    const enrollmentForm = document.getElementById('enrollmentForm');
    const adminControls = document.getElementById('adminControls');
    const policyStatusDisplay = document.getElementById('policyStatusDisplay');
    const claimPayoutBtn = document.getElementById('claimPayoutBtn');
    const claimPayoutBtnHindi = document.getElementById('claimPayoutBtnHindi');

    if (currentAccount) {
        connectBtn.textContent = (document.body.classList.contains('language-hindi') ? 'जुड़ा हुआ है: ' : 'Connected: ') + formatAddress(currentAccount);
        connectBtn.classList.add('connected');
        connectBtn.style.display = 'none'; 
        disconnectBtn.style.display = 'inline-flex'; 
        currentAccountDisplay.innerHTML = (document.body.classList.contains('language-hindi') ? 'आपका खाता: ' : 'Your Account: ') + `<strong>${currentAccount}</strong>`;

        enrollmentForm.style.display = 'block';

        
        if (contractOwnerAddress && currentAccount.toLowerCase() === contractOwnerAddress.toLowerCase()) {
            adminControls.style.display = 'block';
        } else {
            adminControls.style.display = 'none';
        }

        
        await getPolicyDetailsAndDisplay();

    } else {
        connectBtn.textContent = document.body.classList.contains('language-hindi') ? 'वॉलेट कनेक्ट करें' : 'Connect Wallet';
        connectBtn.classList.remove('connected');
        connectBtn.style.display = 'inline-flex';
        disconnectBtn.style.display = 'none';
        currentAccountDisplay.innerHTML = document.body.classList.contains('language-hindi') ? 'कनेक्ट नहीं है' : 'Not Connected';
        enrollmentForm.style.display = 'none';
        adminControls.style.display = 'none';
        policyStatusDisplay.style.display = 'none';
        claimPayoutBtn.style.display = 'none';
        claimPayoutBtnHindi.style.display = 'none';
    }
}

async function enrollInPlan(planType) {
    if (!contract) {
        showMessage("Please connect your wallet first.", "error");
        return;
    }

    const cropType = document.getElementById('cropType').value;
    const landArea = parseInt(document.getElementById('landArea').value);

    if (!cropType || isNaN(landArea) || landArea <= 0) {
        showMessage("Please enter valid Crop Type and Land Area.", "error");
        return;
    }

    let premiumAmount;
    if (planType === 1) premiumAmount = ethers.utils.parseEther("0.004"); 
    else if (planType === 2) premiumAmount = ethers.utils.parseEther("0.007"); 
    else if (planType === 3) premiumAmount = ethers.utils.parseEther("0.012"); 
    else {
        showMessage("Invalid plan selected.", "error");
        return;
    }

    showMessage("Sending transaction to subscribe to policy...", "info");
    try {
        const tx = await contract.subscribePolicy(cropType, landArea, planType, { value: premiumAmount });
        await tx.wait(); 
        showMessage("Policy subscribed successfully! Transaction Hash: " + tx.hash, "success");
        await getPolicyDetailsAndDisplay(); 
    } catch (error) {
        console.error("Error subscribing to policy:", error);
        showMessage(`Transaction failed: ${error.reason || error.message || error}`, "error");

    }
}

async function simulateWeatherEvent() {
    if (!contract || (contractOwnerAddress && currentAccount.toLowerCase() !== contractOwnerAddress.toLowerCase())) {
        showMessage("You are not the contract owner to perform this action.", "error");
        return;
    }

    const farmerAddressForSimulation = document.getElementById('farmerAddressForSimulation').value;
    const eventType = document.getElementById('weatherEventType').value;

    if (!ethers.utils.isAddress(farmerAddressForSimulation)) {
        showMessage("Please enter a valid Farmer Address for Simulation.", "error");
        return;
    }
    if (!eventType) {
        showMessage("Please enter an event type.", "error");
        return;
    }

    showMessage(`Simulating weather event "${eventType}" for ${formatAddress(farmerAddressForSimulation)}...`, "info");

    try {
        
        const tx = await contract.simulateWeatherEvent(farmerAddressForSimulation, eventType);
        await tx.wait();
        showMessage(`Weather event "${eventType}" simulated successfully for ${formatAddress(farmerAddressForSimulation)}! Transaction Hash: ${tx.hash}`, "success");
        await getPolicyDetailsAndDisplay(); 
    } catch (error) {
        console.error("Error simulating weather event:", error);
        showMessage(`Failed to simulate event: ${error.reason || error.message || error}`, "error");

    }
}

async function claimPayout() {
    if (!contract) {
        showMessage("Please connect your wallet first.", "error");
        return;
    }

    showMessage("Attempting to claim payout...", "info");
    try {
        const tx = await contract.claimPayout();
        await tx.wait();
        showMessage("Payout claimed successfully! Funds transferred. Transaction Hash: " + tx.hash, "success");
        await getPolicyDetailsAndDisplay(); 
    } catch (error) {
        console.error("Error claiming payout:", error);
        showMessage(`Failed to claim payout: ${error.reason || error.message || error}`, "error");

    }
}

async function withdrawFunds() {
    if (!contract || (contractOwnerAddress && currentAccount.toLowerCase() !== contractOwnerAddress.toLowerCase())) {
        showMessage("You are not the contract owner to perform this action.", "error");
        return;
    }

    showMessage("Attempting to withdraw contract funds...", "info");
    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        showMessage("Contract funds withdrawn successfully! Transaction Hash: " + tx.hash, "success");
    } catch (error) {
        console.error("Error withdrawing funds:", error);
       showMessage(`Failed to withdraw funds: ${error.reason || error.message || error}`, "error");

    }
}

async function getPolicyDetailsAndDisplay() {
    const policyStatusDisplay = document.getElementById('policyStatusDisplay');
    const claimPayoutBtn = document.getElementById('claimPayoutBtn');
    const claimPayoutBtnHindi = document.getElementById('claimPayoutBtnHindi');
    policyStatusDisplay.style.display = 'block';
    claimPayoutBtn.style.display = 'none';
    claimPayoutBtnHindi.style.display = 'none';

    if (!contract || !currentAccount) {
        policyStatusDisplay.textContent = document.body.classList.contains('language-hindi') ? 'नीति की स्थिति उपलब्ध नहीं है (वॉलेट कनेक्ट नहीं है)' : 'Policy status not available (wallet not connected)';
        return;
    }

    try {
        const policy = await contract.getPolicyDetails(currentAccount);
        const policyStatus = ["Active", "Payout Triggered", "Claimed"]; 
        const policyStatusHindi = ["सक्रिय", "भुगतान ट्रिगर किया गया", "दावा किया गया"];

        if (policy.farmerAddress === '0x0000000000000000000000000000000000000000') {
           policyStatusDisplay.innerHTML = `
  <p class="english">You do not have an active policy. Enroll in one above!</p>
  <p class="hindi">आपके पास कोई सक्रिय नीति नहीं है। ऊपर एक में नामांकन करें!</p>
`;

        } else {
            const statusTextEnglish = policyStatus[policy.status];
            const statusTextHindi = policyStatusHindi[policy.status];
            const premiumEth = ethers.utils.formatEther(policy.premiumPaid);
            const insuranceEth = ethers.utils.formatEther(policy.insuranceAmount);

            policyStatusDisplay.innerHTML = `
                <p><strong class="english">Your Policy Details:</strong><strong class="hindi">आपकी नीति का विवरण:</strong></p>
                <p class="english">Crop Type: <strong>${policy.cropType}</strong></p><p class="hindi">फसल का प्रकार: <strong>${policy.cropType}</strong></p>
                <p class="english">Land Area: <strong>${policy.landAreaSqMeters} Sq Meters</strong></p><p class="hindi">भूमि क्षेत्र: <strong>${policy.landAreaSqMeters} वर्ग मीटर</strong></p>
                <p class="english">Premium Paid: <strong>${parseFloat(premiumEth).toFixed(4)} ETH</strong></p><p class="hindi">भुगतान किया गया प्रीमियम: <strong>${parseFloat(premiumEth).toFixed(4)} ETH</strong></p>
                <p class="english">Insurance Amount: <strong>${parseFloat(insuranceEth).toFixed(4)} ETH</strong></p><p class="hindi">बीमा राशि: <strong>${parseFloat(insuranceEth).toFixed(4)} ETH</strong></p>
                <p class="english">Status: <strong>${statusTextEnglish}</strong></p><p class="hindi">स्थिति: <strong>${statusTextHindi}</strong></p>
            `;

            
            if (policy.status === 1) { 
                claimPayoutBtn.style.display = 'inline-flex';
                claimPayoutBtnHindi.style.display = 'inline-flex';
            } else {
                claimPayoutBtn.style.display = 'none';
                claimPayoutBtnHindi.style.display = 'none';
            }
        }
    } catch (error) {
        console.error("Error fetching policy details:", error);
policyStatusDisplay.innerHTML = `
  <p class="english">Error fetching policy details: ${error.message}</p>
  <p class="hindi">नीति विवरण प्राप्त करने में त्रुटि: ${error.message}</p>
`;

    }
}



function changeLanguage(lang) {
    const isHindi = lang === 'hindi';
    document.body.classList.toggle('language-hindi', isHindi);
    document.querySelector('.language-btn.english').classList.toggle('active', !isHindi);
    document.querySelector('.language-btn.hindi').classList.toggle('active', isHindi);
    
    updateUI();
}


const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');

function openMobileMenu() {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}


function createTopEffects() {
    const container = document.getElementById('topEffects');
    const rainDrops = [];

    function createRainDrop() {
        const rainDrop = document.createElement('div');
        rainDrop.className = 'rain-drop';

        const left = Math.random() * 100;
        rainDrop.style.left = `${left}%`;


        const animationDuration = 0.5 + Math.random() * 0.3;
        rainDrop.style.animationDuration = `${animationDuration}s`;


        const delay = Math.random() * 0.5;
rainDrop.style.animationDelay = `${delay}s`;


        const opacity = 0.6 + Math.random() * 0.4;
        rainDrop.style.opacity = opacity;

        container.appendChild(rainDrop);
        rainDrops.push(rainDrop);

        setTimeout(() => {
            rainDrop.remove();
            const index = rainDrops.indexOf(rainDrop);
            if (index > -1) {
                rainDrops.splice(index, 1);
            }
        }, (animationDuration + delay) * 1000);

        if (Math.random() > 0.7) {
            setTimeout(() => createSplash(rainDrop), delay * 500);
        }

        setTimeout(createRainDrop, delay * 500);
    }

    for (let i = 0; i < 30; i++) {
        setTimeout(createRainDrop, i * 50);
    }
}

function createSplash(rainDrop) {
    const splash = document.createElement('div');
    splash.className = 'splash-effect';

    const rect = rainDrop.getBoundingClientRect();
   splash.style.left = `${rect.left + rect.width / 2}px`;

    splash.style.top = `${rect.bottom}px`;


    document.body.appendChild(splash);

    setTimeout(() => {
        splash.style.transform = 'scale(1)';
        splash.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        splash.style.transform = 'scale(0.5)';
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.remove();
        }, 300);
    }, 200);
}

function createLightning() {
    const container = document.getElementById('topEffects');
    const lightning = document.createElement('div');
    lightning.className = 'lightning-bolt';

    lightning.style.left = `${Math.random() * 100}%`;

    lightning.style.top = `${Math.random() * 100}px`;

    lightning.style.transform = `rotate(${Math.random() * 360}deg)`;

    lightning.style.height = `${10 + Math.random() * 30}px`;


    container.appendChild(lightning);

    setTimeout(() => {
        lightning.style.opacity = '1';
        setTimeout(() => {
            lightning.style.opacity = '0';
            setTimeout(() => {
                lightning.remove();
            }, 500);
        }, 100);
    }, 10);

    setTimeout(createLightning, 2000 + Math.random() * 5000);
}

// Three.js Weather Scene
let scene, camera, renderer, rainParticles, cloudParticles = [];
let rainSound, noise, filter, reverb, thunder, thunderstorm, wind, windLFO;
let isAudioPlaying = false;
let lightningTimeout;
let sun, sunLight;

function initThreeJS() {
    const canvas = document.getElementById('threejs-canvas');
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050515, 0.0035);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
    camera.position.y = 10;

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const lightningLight = new THREE.DirectionalLight(0xffffff, 0);
    lightningLight.position.set(1, 1, 1);
    scene.add(lightningLight);

    const ambientLight = new THREE.AmbientLight(0x606070);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x607080, 0.2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    sunLight = new THREE.DirectionalLight(0xFFFF88, 5.0);
    sunLight.position.set(300, 250, -180);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xFFFF00,
        emissiveIntensity: 5.0,
        color: 0xFFD700
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(300, 250, -180);
    scene.add(sun);

    const cloudTexture = createCloudTexture();
    const cloudMaterialBase = new THREE.SpriteMaterial({
        map: cloudTexture,
        color: 0x282c34,
        transparent: true,
        opacity: 0.7,
        blending: THREE.NormalBlending
    });

    for (let i = 0; i < 70; i++) {
        const cloudSprite = new THREE.Sprite(cloudMaterialBase.clone());
        cloudSprite.position.set(
            (Math.random() - 0.5) * 1000,
            (Math.random() * 100) + 50,
            (Math.random() - 0.5) * 600 - 100
        );
        const scale = Math.random() * 150 + 100;
        cloudSprite.scale.set(scale, scale * (0.5 + Math.random() * 0.3), 1);
        cloudSprite.material.opacity = 0.5 + Math.random() * 0.5;
        scene.add(cloudSprite);
        cloudParticles.push(cloudSprite);
    }

    const rainCount = 200000;
    const rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 1] = Math.random() * 800;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
        velocities[i * 3 + 1] = -(Math.random() * 8 + 6);
        velocities[i * 3 + 0] = (Math.random() - 0.5) * 1.0;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
    }
    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    rainGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const rainMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 1.2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    rainParticles = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rainParticles);

    setupLightning(lightningLight);
    animateThreeJS();
}

function setupLightning(light) {
    function triggerLightning() {
        light.intensity = 2.5 + Math.random() * 2.5;
        light.color.setHSL(0.1 + Math.random() * 0.1, 0.9, 0.9);

        const flash = document.getElementById('lightningFlash');
        flash.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';

        setTimeout(() => {
            flash.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        }, 150);

        const delay = 3000 + Math.random() * 5000;

        setTimeout(() => {
            light.intensity = 0;
        }, 150 + Math.random() * 100);
        
        if (Math.random() > 0.6) {
            setTimeout(() => {
                light.intensity = 1.5 + Math.random() * 1.0;
                setTimeout(() => {
                    light.intensity = 0;
                }, 100 + Math.random() * 100);
            }, 200 + Math.random() * 200);
        }

        if (isAudioPlaying) {
            const thunderDelay = 100 + Math.random() * 1500;
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    thunder.start();
                } else {
                    thunderstorm.start();
                }
            }, thunderDelay);
        }
        
        lightningTimeout = setTimeout(triggerLightning, delay);
    }

    setTimeout(triggerLightning, 2000 + Math.random() * 3000);
}

function createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(50, 55, 65, 0.9)');
    gradient.addColorStop(1, 'rgba(30, 35, 45, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
}

function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);

    const positions = rainParticles.geometry.attributes.position.array;
    const velocities = rainParticles.geometry.attributes.velocity.array;
    for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 0] += velocities[i * 3 + 0];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        if (positions[i * 3 + 1] < -300) {
            positions[i * 3 + 1] = 500 + Math.random() * 200;
            positions[i * 3 + 0] = (Math.random() - 0.5) * 1000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
        }
    }
    rainParticles.geometry.attributes.position.needsUpdate = true;

    cloudParticles.forEach(cloud => {
        cloud.position.x += 0.25 + (Math.random() * 0.1);
        if (cloud.position.x > 500) {
            cloud.position.x = -500 - Math.random() * 100;
            cloud.position.y = (Math.random() * 100) + 50;
        }
    });

    if (sun) {
        sun.rotation.y += 0.0005;
        sun.rotation.x += 0.0002;
    }

    const now = new Date();
    const hours = now.getHours();
    if (hours >= 18 || hours < 6) { 
        sunLight.intensity = 0.5; 
    } else {
        sunLight.intensity = 5.0; 
    }


    renderer.render(scene, camera);
}


function setupRainSound() {
    
    if (Tone.context.state !== 'running') {
        Tone.start();
    }

    noise = new Tone.Noise("pink").start();
    noise.volume.value = -12;

    filter = new Tone.Filter({
        frequency: 6000, type: "lowpass", rolloff: -12, Q: 1
    }).toDestination();

    reverb = new Tone.Reverb({
        decay: 4, preDelay: 0.1, wet: 0.4
    }).toDestination();
    
    wind = new Tone.Noise("brown").start();
    wind.volume.value = -25;

    windLFO = new Tone.LFO({
        frequency: "0.3Hz",
        min: -35,
        max: -20
    }).start();

    windLFO.connect(wind.volume);
    wind.connect(reverb);

    
    thunder = new Tone.Player({
        url: "https://assets.codepen.io/3364143/thunder-2.mp3", 
        autostart: false,
        volume: -8
    }).connect(reverb);

    thunderstorm = new Tone.Player({
        url: "https://assets.codepen.io/3364143/thunderstorm.mp3", 
        autostart: false,
        volume: -6,
        playbackRate: 0.8
    }).connect(reverb);

    noise.connect(filter);
    filter.connect(reverb);

    rainSound = { noise, filter, reverb, thunder, thunderstorm, wind, windLFO };

    Tone.Transport.volume.value = -18;
}

function toggleRainSound() {
    
    if (Tone.context.state !== 'running') {
        Tone.start().then(() => {
            if (!rainSound) {
                setupRainSound();
            }
            performAudioToggleLogic();
        });
    } else {
        performAudioToggleLogic();
    }
}

function performAudioToggleLogic() {
    const audioButton = document.getElementById('audioToggleBtn');
    const icon = audioButton.querySelector('i');

    if (Tone.Transport.state === "started") {
        Tone.Transport.pause();
        isAudioPlaying = false;
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
        audioButton.classList.remove('active');
        clearTimeout(lightningTimeout); 
    } else {
        Tone.Transport.start();
        isAudioPlaying = true;
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
        audioButton.classList.add('active');
        
    }
}


function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    if (window.VANTA && window.VANTA.current) {
        window.VANTA.current.resize();
    }
}

function addPinkishLightEffect() {
    const glowElements = document.querySelectorAll(
        '.feature-card, .pricing-card, .testimonial-card, .step, .problem-solution, .component, .btn, .web3-card'
    );

    glowElements.forEach(element => {
        const addGlow = (event) => {
            if (event.type === 'touchstart') {
                event.preventDefault();
            }
            element.classList.add('pink-glow');
            setTimeout(() => {
                element.classList.remove('pink-glow');
            }, 500);
        };

        element.addEventListener('click', addGlow);
        element.addEventListener('touchstart', addGlow);
    });

    const iconGlowElements = document.querySelectorAll(
        '.logo i, .feature-icon i, .component h4 i, .pricing-features li i, .footer-column ul li i.link-icon, .social-links a i, .audio-toggle-btn i, .mobile-menu-btn i'
    );

    iconGlowElements.forEach(iconElement => {
        const addIconGlow = (event) => {
            if (event.type === 'touchstart') {
                event.preventDefault();
            }
            iconElement.classList.add('icon-pink-glow');
            setTimeout(() => {
                iconElement.classList.remove('icon-pink-glow');
            }, 500);
        };

        iconElement.addEventListener('click', addIconGlow);
        iconElement.addEventListener('touchstart', addIconGlow);
    });
}


// Initialize everything when the window loads
window.addEventListener('load', () => {
    initThreeJS();
    createTopEffects();
    createLightning();
    addPinkishLightEffect();

    if (window.VANTA) {
        VANTA.BIRDS({
            el: "#birds",
            backgroundColor: 0x000000,
            color1: 0xff8cb4,
            color2: 0xff6fae,
            birdSize: 1.5,
            wingSpan: 20,
            speedLimit: 4.0,
            separation: 40,
            alignment: 30,
            cohesion: 20,
            quantity: 4.0
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                if (mobileMenu.classList.contains('active')) closeMobileMenu();
            }
        });
    });

    
    updateUI();
});

window.addEventListener('resize', onWindowResize, false);
