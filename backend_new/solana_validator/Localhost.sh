#!/bin/bash

#Start Solana Local Cluster and wait for 5 seconds
echo "Starting Solana Local Cluster..."
solana-test-validator --reset > /dev/null 2>&1 &
echo "Solana Local Cluster Started"
echo 
sleep 5

#Create landlord and tenant wallet and assigned to variables
echo "Creating Landlord and Tenant Wallets..."
landlord=$(solana-keygen pubkey BArjoV1rB46LZXLL7SEmjwwUPmxiZtxbVc5d1dWZ52Va.json)
tenant=$(solana-keygen pubkey teNhcNH7wbRehkUoC8xM3sUgeckgqEB1phCiAv3VQGd.json)
echo "Landlord Wallet: $landlord"
echo "Tenant Wallet: $tenant"
echo 

# Airdrop to landlord and tenant
echo "Airdropping to Landlord and Tenant..."
echo 
solana airdrop 100 $landlord > /dev/null 2>&1 
solana balance $landlord 
solana airdrop 100 $tenant > /dev/null 2>&1 
solana balance $tenant 
echo "Airdrop Complete"
echo 


#Create usdc token and send it to tenant
echo "Creating USDC Token and token account..."
echo 
usdc_mint=$(spl-token create-token uSDCARvy87Kei3izvHJS3gzecBncTnAeEc2L4qhrJ7o.json | grep "Creating token" | awk '{print $3}')
spl-token create-account $usdc_mint> /dev/null 2>&1 
solana airdrop 100 $usdc_mint > /dev/null 2>&1 
solana balance $usdc_mint
echo "Minting usdc token and sending to tenant..."
spl-token mint $usdc_mint 10000 > /dev/null 2>&1 
spl-token transfer $usdc_mint 5000 $tenant --fund-recipient > /dev/null 2>&1 
echo "USDC Token: $usdc_mint"
echo

#Check tenant USDC balance
echo "Tenant USDC Balance:"
spl-token accounts --owner teNhcNH7wbRehkUoC8xM3sUgeckgqEB1phCiAv3VQGd
echo -e "\n\n"

#Stop validator
pid=$(ps -ef | grep solana-test-validator | grep -v grep | awk '{print $2}')
echo "To stop validator type kill -9 ${pid}"
echo -e "\n"