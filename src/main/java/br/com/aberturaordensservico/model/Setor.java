package br.com.aberturaordensservico.model;

import br.com.aberturaordensservico.model.Setor;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table (name = "setor")
public class Setor{

    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // Default constructor
    public Setor() {
    }

    // Constructor with parameters
    public Setor(String nome) {
        this.nome = nome;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}