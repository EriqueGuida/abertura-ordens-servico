package br.com.aberturaordensservico.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EquipamentoRequest {
    
    @NotBlank (message = "O nome do equipamento não pode ser vazio")
    private String nome;

    @NotBlank (message = "O número de patrimônio do equipamento não pode ser vazio")
    private String numeroPatrimonio;

    @NotNull (message = "O ID do setor não pode ser nulo")
    private Long setorId;

    public EquipamentoRequest() {
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

    public Long getSetorId() {
        return setorId;
    }

    public void setSetorId(Long setorId) {
        this.setorId = setorId;
    }
}
