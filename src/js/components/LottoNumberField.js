import { LOTTO_WIN_NUMBER_LENGTH } from '../constants/lotto'
import { LOTTO_ACTIONS_TYPE } from '../constants/store'
import { lottoStore } from '../store'
import { createSignal } from '../utils/createSignal'
import { createEl, getAllEl, getEl } from '../utils/dom'

export const LottoNumberField = (target, { onOpenModal }) => {
  const [isValid, setIsValid] = createSignal(false)

  const Element = createEl(`
    <form class="mt-9">
      <label class="flex-auto d-inline-block mb-3"
        >지난 주 당첨번호 6개와 보너스 넘버 1개를 입력해주세요.</label
      >
      <div class="d-flex">
        <div>
          <h4 class="mt-0 mb-3 text-center">당첨 번호</h4>
          <div>
            ${Array.from({ length: LOTTO_WIN_NUMBER_LENGTH })
              .map(
                () => `
                <input
                  type="number"
                  class="winning-number mx-1 text-center"
                />
              `
              )
              .join('')}
          </div>
        </div>
        <div class="bonus-number-container flex-grow">
          <h4 class="mt-0 mb-3 text-center">보너스 번호</h4>
          <div class="d-flex justify-center">
            <input type="number" class="bonus-number text-center" />
          </div>
        </div>
      </div>
      <button
        type="button"
        class="open-result-modal-button mt-5 btn btn-cyan w-100"
      >
        결과 확인하기
      </button>
    </form>
  `)
  const OpenResultButton = getEl('.open-result-modal-button', Element)

  const updateWinNumber = () => {
    const WinningNumberList = getAllEl('.winning-number', Element)
    const winNumberText = Array.from(WinningNumberList).reduce(
      (prev, cur) => `${prev ? `${prev},` : prev}${cur.value}`,
      ''
    )

    lottoStore.dispatch(LOTTO_ACTIONS_TYPE.UPDATE_WIN_NUMBER, {
      winNumberText,
      onSuccess: () => {
        setIsValid(true)
        WinningNumberList.forEach(input => input.setAttribute('disabled', true))
      },
      onError: error => {
        setIsValid(false)
        alert(error.message)
      }
    })
  }

  const updateBonusNumber = () => {
    const BonusNumber = getEl('.bonus-number', Element)
    const bonusNumberText = BonusNumber.value

    if (!isValid()) {
      return
    }

    lottoStore.dispatch(LOTTO_ACTIONS_TYPE.UPDATE_BONUS_NUMBER, {
      bonusNumberText,
      onSuccess: () => {
        setIsValid(true)
        BonusNumber.setAttribute('disabled', true)
      },
      onError: error => {
        setIsValid(false)
        alert(error.message)
      }
    })
  }

  const handleClickResultButton = () => {
    updateWinNumber()
    updateBonusNumber()

    if (isValid()) {
      onOpenModal()
    }
  }

  return {
    render: () => {
      OpenResultButton.addEventListener('click', handleClickResultButton)

      target.append(Element)
    },
    destroy: () => {
      OpenResultButton.removeEventListener('click', handleClickResultButton)
    }
  }
}
