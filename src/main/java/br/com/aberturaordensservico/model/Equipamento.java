package br.com.aberturaordensservico.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity 
@Table (name = "equipamento")
public class Equipamento {  
    
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank (message = "O nome do equipamento não pode ser vazio")
    private String nome;

    @NotBlank (message = "O número de patrimônio do equipamento não pode ser vazio")
    private String numeroPatrimonio;

    @ManyToOne
    @JoinColumn (name = "setor_id", nullable = false)
    @NotNull (message = "O setor do equipamento não pode ser vazio")
    private Setor setor;

    // Default constructor
    public Equipamento() {
    }

    // Constructor com parâmetros
    public Equipamento(String nome, String numeroPatrimonio, Setor setor) {
        this.nome = nome;
        this.numeroPatrimonio = numeroPatrimonio;
        this.setor = setor;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    } 

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNumeroPatrimonio() {
        return numeroPatrimonio;
    }

    public void setNumeroPatrimonio(String numeroPatrimonio) {
        this.numeroPatrimonio = numeroPatrimonio;
    }

    public Setor getSetor() {
        return setor;
    }

    public void setSetor(Setor setor) {
        this.setor = setor;
    }

}
