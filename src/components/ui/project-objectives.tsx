'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Heart, Target, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectObjectivesProps {
  cognitifs?: string[]
  affectifs?: string[]
  conatifs?: string[]
  className?: string
  title?: string
  compact?: boolean
}

interface ObjectiveItemProps {
  objectives: string[]
  type: 'cognitifs' | 'affectifs' | 'conatifs'
  compact?: boolean
}

// Composant pour une liste d'objectifs d'un type donné
function ObjectiveItem({ objectives, type, compact = false }: ObjectiveItemProps) {
  if (!objectives || objectives.length === 0) return null

  const getTypeInfo = () => {
    switch (type) {
      case 'cognitifs':
        return {
          icon: <Brain className="h-4 w-4" />,
          label: 'Cognitifs',
          description: 'Connaissances et compétences intellectuelles',
          color: 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/30'
        }
      case 'affectifs':
        return {
          icon: <Heart className="h-4 w-4" />,
          label: 'Affectifs',
          description: 'Attitudes et émotions',
          color: 'bg-pink-400/10 text-pink-300 border border-pink-400/30'
        }
      case 'conatifs':
        return {
          icon: <Target className="h-4 w-4" />,
          label: 'Conatifs',
          description: 'Actions et comportements',
          color: 'bg-purple-400/10 text-purple-300 border border-purple-400/30'
        }
    }
  }

  const typeInfo = getTypeInfo()

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={typeInfo.color}>
            <span className="flex items-center gap-1">
              {typeInfo.icon}
              {typeInfo.label}
            </span>
          </Badge>
          <span className="text-xs text-gray-300">
            {objectives.length} objectif{objectives.length > 1 ? 's' : ''}
          </span>
        </div>
        <ul className="text-sm space-y-1">
          {objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-3 w-3 mt-0.5 text-cyan-400 flex-shrink-0" />
              <span className="text-gray-200">{objective}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <Card className="w-full bg-black/30 border-gray-700/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            {typeInfo.icon}
            {typeInfo.label}
          </CardTitle>
          <Badge variant="secondary" className={typeInfo.color}>
            {objectives.length}
          </Badge>
        </div>
        <p className="text-sm text-gray-300">{typeInfo.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-3">
          {objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-200">
              <CheckCircle className="h-4 w-4 mt-0.5 text-cyan-400 flex-shrink-0" />
              <span className="text-sm">{objective}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Composant principal pour tous les objectifs
export function ProjectObjectives({ 
  cognitifs, 
  affectifs, 
  conatifs, 
  className, 
  title = "Objectifs",
  compact = false 
}: ProjectObjectivesProps) {
  const hasObjectives = (cognitifs && cognitifs.length > 0) || 
                       (affectifs && affectifs.length > 0) || 
                       (conatifs && conatifs.length > 0)

  if (!hasObjectives) return null

  const totalObjectives = (cognitifs?.length || 0) + (affectifs?.length || 0) + (conatifs?.length || 0)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Badge variant="outline" className="border-cyan-400/30 text-cyan-300 bg-cyan-400/10">
          {totalObjectives} objectif{totalObjectives > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className={cn(
        compact ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      )}>
        {cognitifs && cognitifs.length > 0 && (
          <ObjectiveItem objectives={cognitifs} type="cognitifs" compact={compact} />
        )}
        
        {affectifs && affectifs.length > 0 && (
          <ObjectiveItem objectives={affectifs} type="affectifs" compact={compact} />
        )}
        
        {conatifs && conatifs.length > 0 && (
          <ObjectiveItem objectives={conatifs} type="conatifs" compact={compact} />
        )}
      </div>
    </div>
  )
}

// Composant pour afficher les cibles et stratégie créative
export function ProjectStrategy({ 
  cibles, 
  strategie_creative, 
  className 
}: { 
  cibles?: string
  strategie_creative?: string
  className?: string 
}) {
  const hasContent = cibles || strategie_creative

  if (!hasContent) return null

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-white">Stratégie et ciblage</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cibles && (
          <Card className="bg-black/30 border-gray-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-white">
                <Target className="h-4 w-4 text-cyan-400" />
                Cibles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-200 leading-relaxed">
                {cibles}
              </p>
            </CardContent>
          </Card>
        )}

        {strategie_creative && (
          <Card className="bg-black/30 border-gray-700/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-white">
                <Brain className="h-4 w-4 text-pink-400" />
                Stratégie créative
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-200 leading-relaxed">
                {strategie_creative}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 