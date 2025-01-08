// 🏦 Bank and Account System 
// Bank Class: Manages multiple accounts
class Bank {
    constructor() {
        this.accounts = []; // Stores all accounts in the bank
    }

    // Add methods here:
    // Example: createAccount(name, initialDeposit)
    createAccount (name, initialDeposit) {
        // Check for the existance of another account by that id
        if (!this.accounts.some(account => account.name === name)){
            const newAccount = new Account(name, initialDeposit);
            this.accounts.push(newAccount);
            return newAccount;
        }
        /* Ideally we would notify the conflict but that is beyond the scope of this assignment.
        Also, we would use an id instead of using name as the primary key
        
        console.log("Conflict: account already exists");
        */
    }
}

// Account Class: Represents a single user's account
class Account {
    constructor(name, balance = 0) {
        this.name = name; // Account holder's name
        this.balance = balance; // Initial balance (default is 0)
        this.transactionHistory = []; // Keeps a record of all transactions
    }

    // Add methods here:
    // Example: deposit(amount) 
    // example data to be stored in transactionHistory { transactionType: 'Deposit', amount: 500 }
    deposit (amount) {
        if (amount < 0) {
            console.log("Deposit must be positive");
            return;
        }

        this.balance += amount;
        this.recordTransaction('Deposit', amount);

    }

    // Example: withdraw(amount)
    // example data to be stored in transactionHistory { transactionType: 'Withdrawal', amount: 200 }
    withdraw (amount) {
        if (amount < 0) {
            console.log("Withdrawal must be positive");
            return;
        }
        if (this.balance < amount){
            console.log("Insufficient amount");
            return;
        }
        this.balance -= amount;
        this.recordTransaction('Withdrawal', amount);
    }
    // Example: transfer(amount, recipientAccount)
    // example data to be stored in transactionHistory:
    // for account sending { transactionType: 'Transfer', amount: 300, to: recipientName }
    // for account recieving { transactionType: 'Received', amount: 300, from: senderName }
    
    transfer (amount, recipientAccount) {
        if (this.balance < amount){
            console.log("Insufficient amount");
            return;
        }
        /* 
        Below code is architecturally undesirable and messy because tags are trying to be business behaviours 
        (ie. "Transfers", "Received" should not be on the same logical level of transactionType as withdraw and deposit).
        Ideally, we would have a "tag" or "label" attribute (plus other info like "to" and "from") that we can optionally add to 
        in methods deposit and withdraw to avoid exposing "amount", resulting in duplicate code.
        But this is obviously beyond the scope of this assignment; author is just following the examples provided
        */
        this.balance -= amount;
        this.recordTransaction('Transfer', amount, {to: recipientAccount.name}); 
        recipientAccount.balance += amount;
        recipientAccount.recordTransaction('Received', amount, {from: this.name});
    }
    // Example: checkBalance()

    checkBalance () {
        return this.balance;
    }

    recordTransaction(transactionName, amount, additionalData = null){
        const newTransaction = {
            transactionType: transactionName,
            amount: amount
        };
        this.transactionHistory.push({...newTransaction, ...additionalData});
    }
}

//<-------------------------------DO NOT WRITE BELOW THIS LINE------------------------------>

// Function to test bank operations
function testBankOperations() {
    const bank = new Bank();

    // Create new accounts
    const johnAccount = bank.createAccount('John Doe', 1000);
    const janeAccount = bank.createAccount('Jane Doe', 500);
    console.log('Accounts created:', johnAccount, janeAccount);

    // Perform some operations on John's account
    johnAccount.deposit(500);
    johnAccount.withdraw(200);

    // Perform a transfer from John to Jane
    johnAccount.transfer(300, janeAccount);

    // Check balances
    const johnFinalBalance = johnAccount.checkBalance();
    const janeFinalBalance = janeAccount.checkBalance();
    console.log('John\'s balance:', johnFinalBalance);
    console.log('Jane\'s balance:', janeFinalBalance);

    // Return balances for testing
    return { 
        johnFinalBalance, 
        janeFinalBalance, 
        johnTransactionHistory: johnAccount.transactionHistory, 
        janeTransactionHistory: janeAccount.transactionHistory 
    };
}

module.exports = testBankOperations;

//<-------------------------------DO NOT WRITE ABOVE THIS LINE------------------------------>


console.log(testBankOperations());
