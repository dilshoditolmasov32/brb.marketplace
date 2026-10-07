# Nasiya hisob-kitobi

Kod: `app/utils/calculateLoan.ts`
Testlar: `tests/unit/calculateLoan.test.ts`

## Formula

Annuitet (har oy bir xil to'lov):

```text
oylik to'lov = P × r / (1 − (1 + r)^−n)

P — nasiya summasi (so'm)
r — oylik stavka = yillik stavka / 100 / 12
n — muddat (oy)
```

Stavka 0% bo'lsa: `oylik to'lov = P / n`.

## Yaxlitlash qoidasi

1. Oylik to'lov **bir marta**, butun so'mgacha yaxlitlanadi.
2. Qolgan qiymatlar yaxlitlangan to'lovdan butun sonlarda hisoblanadi:
   - `jami to'lov = oylik to'lov × n`
   - `jami foiz = jami to'lov − P`

Shu sabab ekrandagi raqamlar har doim bir-biriga to'g'ri keladi (`oylik × oy = jami`).

## Namuna

| Kirish                             | Natija                |
| ---------------------------------- | --------------------- |
| 12 000 000 so'm, 24% yillik, 12 oy | oylik: 1 134 715 so'm |
|                                    | jami: 13 616 580 so'm |
|                                    | foiz: 1 616 580 so'm  |

Bu qiymatlar dizayndagi namuna bilan bir xil va testda qayd etilgan.

## Cheklovlar

- Komissiya, sug'urta va boshlang'ich to'lov hisobga **kirmaydi**.
- Stavka, limit va muddatlar `app/constants/finance.ts` dagi **namuna** qiymatlar.
  Haqiqiy shartlar backenddan kelishi kerak.
- Natija dastlabki hisob; yakuniy taklif emas. Interfeysda bu har doim yozib qo'yiladi.
- Mock API narxlari dollarda keladi va `1 $ = 12 500 so'm` namuna kursi bilan
  so'mga o'giriladi (`app/utils/mapProduct.ts`).
