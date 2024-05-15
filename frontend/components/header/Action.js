const Action = ({ setModalOpen, connected }) => {
    const onNewTransaction = () => {
        setModalOpen(true)
    }

    return (
        <div>
        {!connected ? (
            <button disabled className="w-full rounded-lg bg-[#128a36] py-3 opacity-50">
              <span className="font-medium text-white">Unavailable</span>
            </button>
          ) : (
            <button onClick={onNewTransaction} className="w-full rounded-lg bg-[#16d542] py-3 hover:bg-opacity-70">
              <span className="font-medium text-white">New</span>
            </button>
          )
        }
        </div>
    )
}

export default Action
