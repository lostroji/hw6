
function prepareReminderRequest(data, loanId) {
    const { loans, readers } = data

    // Find the requested loan
    function loanArray(loanItem) {
        return loanItem.id === loanId
    }

    const foundLoan = loans.find(loanArray)

    // Find the report row belonging to this specific loan
    function matchLoanRow(outputItem) {
        return outputItem.loanId === foundLoan.id
    }

    const foundLoanRow = foundLoan
        ? buildLoanRows(data).find(matchLoanRow)
        : null

    // Find the reader belonging to this loan
    function availableReaderId(readerItem) {
        return readerItem.id === foundLoan.readerId
    }

    const foundReader = foundLoan
        ? readers.find(availableReaderId)
        : null

    // 1. Check whether the loan exists
    if (!foundLoan) {
        return "null - loan not found"
    } else if (foundLoan.returned) {
        // 2. Check whether the loan has already been returned
        return "null - already returned"
    } else if (foundLoanRow.status !== "overdue") {
        // 3. Check whether the loan is overdue
        return "null - not overdue"
    } else if (!foundReader) {
        // 4. Check whether the reader exists
        return "null - reader not found"
    } else if (!foundReader.contact || !foundReader.contact.email) {
        // 5. Check whether the reader has a non-empty email
        return "null - no email"
    } else {
        // Create a new loan and a new reminder object
        return {
            ...foundLoan,
            reminder: {
                ...foundLoan.reminder,
                requested: true
            }
        }
    }
}

// Tests
console.log(prepareReminderRequest(libraryData, "L2"))
console.log(prepareReminderRequest(libraryData, "L3"))
console.log(prepareReminderRequest(libraryData, "L4"))
console.log(prepareReminderRequest(libraryData, "L5"))
console.log(prepareReminderRequest(libraryData, "L6"))
console.log(prepareReminderRequest(libraryData, "L99"))

console.log(prepareReminderRequest(libraryData, "L1"))
