function buildLibraryReport(data) {

    const {readers, books, loans} = data
    const {loanId} = buildLoanRows(data)


    const loanCount = loans.length
    const activeCount = loans.filter(filterReturnedBooks).length
    const firstAppOutput = buildLoanRows(data).filter(filterOverdueLoans).length
    const totalOverdueDays = buildLoanRows(data).reduce(totalOverdueDaysCounter, 0)

    const maxDays = buildLoanRows(data).reduce(maxHighestOverdue, 0)

    // filter the ones that are not returned
    function filterReturnedBooks(loanItem) {
        return !loanItem.returned
    }

    // filter overdue items
    function filterOverdueLoans(outputItem) {
        return outputItem.status === "overdue"
    }


    // filter the loan items that are matching with the found reader items
    function filterFindReaders(loanInfo) {
        const {readerId} = loanInfo

        // find the loans with no readers matching
        function loansWithNoMatch(readerItem) {
            return readerId === readerItem.id
        }

        return !data.readers.find(loansWithNoMatch)
    }


    // reduce function -> total overdue Days
    function totalOverdueDaysCounter(total, overdueVal) {
        return total + overdueVal.overdueDays
    }


    // reduce the highest overdue item
    function maxHighestOverdue(maxOverdueVal, overdueValue) {
        return Math.max(maxOverdueVal, overdueValue.overdueDays)
    }

    function findIdMaxDays(loanItem) {
        return loanItem.overdueDays === maxDays
    }

    // map the byReader
    function byReaderMapper(readerList) {
        const {id, profile} = readerList
        return {
            readerId: id,
            readerLabel: profile.displayName,
            activeCount: activeCount,
            overdueCount: firstAppOutput,
            totalOverdueDays: totalOverdueDays,
        }
    }

    return {
        loanCount: loanCount,
        activeCount: activeCount,
        overdueCount: firstAppOutput,
        totalOverdueDays: totalOverdueDays,
        unmatchedReaderLaonCount: data.loans.filter(filterFindReaders).length,
        mostOverdueLoanId: maxDays === 0
            ? null
            : buildLoanRows(data).find(findIdMaxDays).loanId,
        byReader: readers.map(byReaderMapper),
    }
}

console.log(buildLibraryReport(libraryData))