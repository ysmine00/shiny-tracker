import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

/**
 * All hunt CRUD operations + realtime subscription.
 * userId scopes all queries to a specific trainer.
 */
export function useHunts(userId) {
  const [hunts, setHunts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHunts = useCallback(async () => {
    if (!userId) {
      setHunts([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('hunts')
      .select('*')
      .eq('userId', userId)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      toast.error('Failed to load hunts')
    } else {
      setHunts(data || [])
    }
    setLoading(false)
  }, [userId])

  // Initial fetch
  useEffect(() => {
    fetchHunts()
  }, [fetchHunts])

  // Realtime subscription
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`hunts:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hunts',
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setHunts((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setHunts((prev) =>
              prev.map((h) => (h.id === payload.new.id ? payload.new : h))
            )
          } else if (payload.eventType === 'DELETE') {
            setHunts((prev) => prev.filter((h) => h.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  const addHunt = useCallback(async (huntData) => {
    const { data, error } = await supabase
      .from('hunts')
      .insert([{ ...huntData, userId: userId }])
      .select()
      .single()

    if (error) {
      toast.error('Failed to add hunt')
      throw error
    }
    toast.success(`${huntData.display_name} added!`)
    return data
  }, [userId])

  const updateHunt = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('hunts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('userId', userId)
      .select()
      .single()

    if (error) {
      toast.error('Failed to update hunt')
      throw error
    }
    toast.success('Hunt updated!')
    return data
  }, [userId])

  const deleteHunt = useCallback(async (id, name) => {
    const { error } = await supabase
      .from('hunts')
      .delete()
      .eq('id', id)
      .eq('userId', userId)

    if (error) {
      toast.error('Failed to delete hunt')
      throw error
    }
    toast.success(`${name} removed`)
  }, [userId])

  const incrementAttempts = useCallback(async (id, current) => {
    return updateHunt(id, { attempts: current + 1 })
  }, [updateHunt])



  return {
    hunts,
    loading,
    error,
    addHunt,
    updateHunt,
    deleteHunt,
    incrementAttempts,
    refetch: fetchHunts,
  }
}
