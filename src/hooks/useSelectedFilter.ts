// src/hooks/useFilters.ts
import { useState, useCallback } from 'react'
import { FiltersTagType } from 'src/sharedTypes/sharedTypes'

// Теперь значения — массивы строк
type FiltersState = Partial<Record<FiltersTagType, string[]>>

export const useFilters = () => {
  const [filters, setFilters] = useState<FiltersState>({})

  // Добавить значение в фильтр (без дубликатов)
  const addFilter = useCallback((type: FiltersTagType, value: string) => {
    setFilters((prev) => {
      const current = prev[type] || []
      if (current.includes(value)) return prev // уже есть — не добавляем
      return { ...prev, [type]: [...current, value] }
    })
  }, [])

  // Удалить значение из фильтра
  const removeFilter = useCallback((type: FiltersTagType, value: string) => {
    setFilters((prev) => {
      const current = prev[type] || []
      const updated = current.filter((v) => v !== value)
      if (updated.length === 0) {
        // Если ничего не осталось — удаляем ключ
        const { [type]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [type]: updated }
    })
  }, [])

  // Переключить значение (добавить/удалить)
  const toggleFilter = useCallback((type: FiltersTagType, value: string) => {
    setFilters((prev) => {
      const current = prev[type] || []
      if (current.includes(value)) {
        // Удаляем
        const updated = current.filter((v) => v !== value)
        if (updated.length === 0) {
          const { [type]: _, ...rest } = prev
          return rest
        }
        return { ...prev, [type]: updated }
      } else {
        // Добавляем
        return { ...prev, [type]: [...current, value] }
      }
    })
  }, [])

  // Очистить один тип фильтра полностью
  const clearFilter = useCallback((type: FiltersTagType) => {
    setFilters((prev) => {
      const { [type]: _, ...rest } = prev
      return rest
    })
  }, [])

  // Очистить всё
  const clearAllFilters = useCallback(() => {
    setFilters({})
  }, [])

  return {
    filters,
    addFilter,
    removeFilter,
    toggleFilter,
    clearFilter,
    clearAllFilters,
  }
}
