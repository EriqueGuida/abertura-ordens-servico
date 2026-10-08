package br.com.aberturaordensservico.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.aberturaordensservico.model.Equipamento;
import br.com.aberturaordensservico.service.EquipamentoService;
import jakarta.validation.Valid;

@RestController
public class EquipamentoController {
    
    private final EquipamentoService equipamentoService;
    
    // Constructor
    public EquipamentoController(EquipamentoService equipamentoService) {
        this.equipamentoService = equipamentoService;
    }
    
    // Métodos do CRUD
    @PostMapping("/equipamentos")
    public Equipamento cadastrarEquipamento(@Valid @RequestBody Equipamento equipamento) {
        return equipamentoService.cadastrarEquipamento(equipamento);
    }

    @GetMapping("/equipamentos")
    public List<Equipamento> listarEquipamentos() {
        return equipamentoService.listarEquipamentos();
    }

    @GetMapping ("/equipamentos/{id}")
    public Equipamento buscarEquipamentoPorId(@PathVariable Long id) {
        return equipamentoService.buscarEquipamentoPorId(id);
    }

    @PutMapping ("/equipamentos/{id}")
    public Equipamento atualizarEquipamento(@PathVariable Long id, @Valid  @RequestBody Equipamento equipamentoAtualizado) {
        return equipamentoService.atualizarEquipamento(id, equipamentoAtualizado);
    }
    
    @DeleteMapping ("/equipamentos/{id}")
    public boolean deletarEquipamento(@PathVariable Long id) {
        return equipamentoService.deletarEquipamento(id);
    }

    @GetMapping("/equipamentos/setor/{setorId}")
    public List<Equipamento> buscarEquipamentosPorSetorId(@PathVariable Integer setorId) {
        return equipamentoService.buscarEquipamentosPorSetorId(setorId);
    }
}