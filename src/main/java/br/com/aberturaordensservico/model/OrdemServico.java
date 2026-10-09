package br.com.aberturaordensservico.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Table (name = "ordem_servico")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrdemServico {
    
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String descricao;
    private LocalDateTime dataAbertura;

    @ManyToOne 
    @JoinColumn (name = "equipamento_id")
    private Equipamento equipamento;
}