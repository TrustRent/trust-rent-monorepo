import { useState, useEffect } from 'react'
import Action from '../components/header/Action'
import NavMenu from '../components/header/NavMenu'
import Profile from '../components/header/Profile'
import NewTransactionModal from '../components/transaction/NewTransactionModal'
import TransactionsList from '../components/transaction/TransactionsList'
import { useWallet } from '@solana/wallet-adapter-react'
import TransactionQRModal from '../components/transaction/TransactionQRModal'
import { useTrustRent } from '../hooks/trustrent'
import NewAgreementModal from '../components/agreement/NewAgreementModal'
import ProfileSettings from '../components/settings/ProfileSettings'

const Home = () => {
    const { connected, publicKey } = useWallet()
    const [transactionQRModalOpen, setTransactionQRModalOpen] = useState(false)
    const [qrCode, setQrCode] = useState(false)

    const [isNewAgreementModalOpen, setIsNewAgreementModalOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('Activity'); 
    const { avatar, userAddress, doTransaction, transactions, setNewTransactionModalOpen, newTransactionModalOpen } = useTrustRent()

    const handleCreateAgreement = async (agreementData) => {
        console.log(agreementData); // Placeholder for blockchain interaction
    };

    const renderContent = () => {
        switch (activeNavItem) {
            case 'Activity':
                return <TransactionsList connected={connected} transactions={transactions} />;
            case 'Agreements':
                return <>
                <br></br>
                <br></br>
                <button onClick={() => setIsNewAgreementModalOpen(true)}>Create New Agreement</button>
                <NewAgreementModal
                    modalOpen={isNewAgreementModalOpen}
                    setModalOpen={setIsNewAgreementModalOpen}
                    createAgreement={handleCreateAgreement}
                />
            </>
            case 'Settings':
                return <>
                <ProfileSettings></ProfileSettings>
                </>
            default:
                return <TransactionsList connected={connected} transactions={transactions} />;
        }
    };
    
    return (
        <div className="flex min-h-screen">
            <header className="flex w-[250px] flex-col bg-[#4667e9] p-12">
            <Profile connected={connected} setModalOpen={setTransactionQRModalOpen} avatar={avatar} userAddress={userAddress} setQrCode={setQrCode} />
                <TransactionQRModal modalOpen={transactionQRModalOpen} setModalOpen={setTransactionQRModalOpen} userAddress={userAddress} setQrCode={setQrCode} myKey={publicKey} />
                <NavMenu connected={connected} publicKey={publicKey} setActiveNavItem={setActiveNavItem} />

                <Action connected={connected} setModalOpen={setNewTransactionModalOpen} />
                <NewTransactionModal modalOpen={newTransactionModalOpen} setModalOpen={setNewTransactionModalOpen} addTransaction={doTransaction} />
                
            </header>
            <main className="flex flex-1 flex-col">
                
                {renderContent()}
            </main>
        </div>
    )
}

export default Home
